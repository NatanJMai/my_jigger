# app/services/ai/menu_forecast_service.rb
#
# Given historical weekly sales data for a menu, calls GPT-3.5-turbo and
# asks it to predict daily sales for the next 30 days per item.
#
# Expected input shape (same as sales_performance_by_menu JSON):
#   {
#     labels: ['Mar 04', 'Mar 11', ...],          # weekly date labels
#     series: [{ name: 'Burger', data: [12, 8, ...] }, ...]
#   }
#
# Returns:
#   { 'Burger' => [4, 6, 5, ...], 'Pizza' => [...] }   # 30 daily values each

class Ai::MenuForecastService
  MAX_ITEMS = 20 # cap sent to GPT to keep the prompt token budget sane

  def initialize(sales_data)
    # sales_data keys may be strings or symbols depending on origin
    @labels = Array(sales_data[:labels] || sales_data['labels'])
    @series = Array(sales_data[:series] || sales_data['series'])
  end

  def generate
    return {} if @series.empty?

    response = client.chat(
      parameters: {
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: system_prompt },
          { role: 'user',   content: user_prompt   }
        ],
        temperature: 0.6,
        max_tokens: 2000
      }
    )

    content = response.dig('choices', 0, 'message', 'content').to_s.strip

    # Strip any markdown fences GPT may wrap the JSON in
    content = content.gsub(/\A```(?:json)?\s*/m, '').gsub(/\s*```\z/m, '').strip

    JSON.parse(content)
  rescue JSON::ParserError => e
    Rails.logger.error("Ai::MenuForecastService — JSON parse error: #{e.message}\nRaw: #{content}")
    {}
  end

  private

  def system_prompt
    <<~SYS.strip
      You are a restaurant sales forecasting expert.
      You MUST produce different, realistic 30-day daily predictions for EACH menu item,
      reflecting that item's own historical trend, average volume, and volatility.
      Do NOT apply the same growth curve to every item.
      Reply ONLY with a valid JSON object — no markdown, no prose, no explanation.
    SYS
  end

  def user_prompt
    items_to_forecast = @series.first(MAX_ITEMS)

    date_range = @labels.any? ? "#{@labels.first} to #{@labels.last}" : "#{@labels.length} weeks"

    # Pre-compute per-item stats so GPT has concrete signals to differentiate items
    item_lines = items_to_forecast.map do |s|
      name = s[:name] || s['name']
      data = Array(s[:data] || s['data']).map(&:to_i)

      n        = data.length
      total    = data.sum
      avg      = n > 0 ? (total.to_f / n).round(1) : 0
      # Trend: compare first half vs second half average
      half     = [n / 2, 1].max
      first_h  = data.first(half).sum.to_f / half
      second_h = data.last(half).sum.to_f / half
      trend    = if second_h > first_h * 1.1 then 'growing'
                 elsif second_h < first_h * 0.9 then 'declining'
                 else
                   'stable'
                 end
      # Simple volatility: std-dev proxy
      variance = n > 1 ? data.sum { |v| (v - avg)**2 } / (n - 1) : 0
      vol      = variance > 0 ? Math.sqrt(variance).round(1) : 0

      "  #{name}: weekly=[#{data.join(', ')}] avg=#{avg}/week trend=#{trend} volatility=±#{vol}"
    end.join("\n")

    # Build the next-30-day date labels with day-of-week context
    start_day = Date.today + 1
    forecast_days = (0...30).map { |i| start_day + i }
    day_labels = forecast_days.map { |d| d.strftime('%b %d (%a)') }.join(', ')

    # Identify which positions (1-indexed) are weekends for the model
    weekend_positions = forecast_days.each_with_index
                                     .select { |d, _| d.saturday? || d.sunday? }
                                     .map { |_, i| i + 1 }
                                     .join(', ')

    <<~PROMPT.strip
      Historical weekly sales data (#{date_range}):
      #{item_lines}

      Task: Predict DAILY sales quantities for each item for the next 30 days:
      #{day_labels}

      Day-of-week context: positions #{weekend_positions} (out of 1–30) fall on weekends.

      Critical rules — you MUST follow all of them:
      1. Each item's forecast MUST differ based on its own avg, trend, and volatility above.
         Do NOT copy the same curve across items.
      2. "growing" items should show a rising trend; "declining" items a falling trend;
         "stable" items should stay near their weekly average with natural variation.
      3. Daily values should average ~(weekly_avg / 7) scaled to reflect the item's trend.
      4. Apply realistic weekend bumps (+15–30%) on the exact weekend positions listed above.
      5. Add natural day-to-day noise proportional to the item's volatility.
      6. All values must be non-negative integers.
      7. Use EXACTLY the same item names as keys (case-sensitive, verbatim).

      Reply ONLY with this JSON object:
      {"ItemName": [day1, day2, ..., day30], ...}
    PROMPT
  end

  def client
    OpenAI::Client.new(access_token: Rails.application.credentials.dig(:openai, :api_key))
  end
end

require 'openai'

class Ai::ChatgptService
  SYSTEM_PROMPT = <<~SYSTEM.strip
    You are an expert hospitality consultant specialising in menu engineering, pricing strategy,
    and profitability optimisation for bars and restaurants.
    Always provide specific, data-driven, and immediately actionable recommendations.
    Never ask follow-up questions. Never offer generic advice.
    When given financial data (costs, margins, sales volumes), use the numbers to justify your suggestions.
    Reply ONLY with valid JSON — no markdown fences, no prose outside the JSON object.
  SYSTEM

  def initialize
    @client = OpenAI::Client.new(access_token: Rails.application.credentials.dig(:openai, :api_key))
  end

  def send_request(ai_prompt_logs)
    return if ai_prompt_logs.empty?

    ai_prompt_logs.each do |log|
      response = @client.chat(
        parameters: {
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user',   content: log.prompt_text }
          ],
          temperature: 0.7
        }
      )

      log.update!(prompt_output: response)
    end
  end
end

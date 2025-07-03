# app/services/menu_analysis_service.rb
require 'liquid'

class Ai::MenuAnalysisService
  TEMPLATE_PATH = Rails.root.join('app', 'templates', 'ai_recommendations')

  def initialize(organization, menu)
    @organization = organization
    @menu = menu
  end

  def pdf_analyse(file)
    extract_data_from_file(file)
  end

  ##
  # Return the records objects to be created in Worker
  # @param topics AiRecommendationTopic
  # @return Object[]
  def analyse(topics)
    return unless topics

    context = {
      'organization_name' => @organization.name,
      'menu_name' => @menu.name,
      'menu_description' => @menu.description,
      'menu_items' => @menu.items.map { |item| format_item(item) }
    }

    ai_prompt_logs = []
    topics.each do |topic|
      template_file = template_file_path(topic)
      return "Template #{topic} not found" unless File.exist?(template_file)

      template = Liquid::Template.parse(File.read(template_file))
      prompt_text = template.render(context)

      ai_prompt_logs << @menu.ai_prompt_logs.create(
        date: DateTime.now,
        prompt_type: topic,
        prompt_input: context,
        prompt_text: prompt_text
      )
    end

    # Call API with prompt_text
    # Ai::ChatgptService.new.send_request(ai_prompt_logs)
  end

  private

  def extract_data_from_file(file)
    return unless file.present?

    if file.content_type == "application/pdf"
      reader = PDF::Reader.new(file.path)
      pages = reader.pages.map(&:text)
    else
      pages = [file.read]
    end

    puts pages
  end

  def template_file_path(topic)
    file_name = "#{topic.name.downcase.gsub(' ', '_')}.liquid"
    TEMPLATE_PATH.join(file_name)
  end

  ##
  # Format Menu Items information to send to API
  # @return Hash
  def format_item(item)
    return unless item

    {
      'name' => item.name,
      'category' => item.category.to_s,
      'price' => Money.new(item.customer_price_cents).to_f,
      'cost' => Money.new(item.costs).to_f,
      'profit_margin' => item.markup_percentage&.round(2),
      'sales_volume' => item.quantity_sold,
      'total_revenue' => Money.new(item.total_value).to_f,
      'total_cost' => Money.new(item.costs.to_f * item.quantity_sold).to_f,
      'total_profit' => Money.new(item.profit * item.quantity_sold).to_f,
      'ingredients' => item.datasheet_lines.pluck(:name).join(', '),
      'preparation_method' => item.prep_method,
      'abc_popularity' => item.get_abc_category,
      'seasonality' => 'Seasonal'
    }
  end
end

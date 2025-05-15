# app/services/menu_analysis_service.rb
require 'liquid'

class Ai::MenuAnalysisService
  TEMPLATE_PATH = Rails.root.join('app', 'templates', 'ai_recommendations')

  def initialize(organization, menu)
    @organization = organization
    @menu = menu
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

    topics.each do |topic|
      template_file = template_file_path(topic)
      return "Template #{topic} not found" unless File.exist?(template_file)

      template = File.read(template_file)
      puts Liquid::Template.parse(template).render(context)
    end
  end

  private

  def template_file_path(topic)
    file_name = "#{topic.downcase.gsub(' ', '_')}.liquid"
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
      'profit_margin' => item.markup_percentage,
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

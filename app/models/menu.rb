class Menu < ApplicationRecord
  belongs_to :organization, class_name: 'Organization'
  has_many :items, class_name: 'Item'
  has_many :categories, class_name: 'Category', through: :items

  validates :name, :organization_id, presence: true

  def ranking_items
    start_date = 1.year.ago
    end_date = Date.today.end_of_month

    items.joins(order_items: :order)
         .where(orders: { date: start_date..end_date })
         .group('items.id')
         .select('items.*, SUM(order_items.quantity) AS total_quantity, SUM(order_items.total_amount_cents) AS total_order_amount')
         .order('total_order_amount DESC, total_quantity DESC')
  end

  def perform_abc_analysis
    menu_items = items.sort_by { |item| -item.total_value } # Sort items by total revenue descending

    total_revenue = menu_items.sum(&:total_value) # Calculate total revenue from all items
    cumulative_value = 0.0

    menu_items.each do |item|
      cumulative_value += item.total_value
      percentage = (cumulative_value / total_revenue) * 100 # Cumulative percentage

      # Categorize based on cumulative percentage
      abc_category = if percentage <= 70
                       'A'
                     elsif percentage <= 90
                       'B'
                     else
                       'C'
                     end

      puts "Updating #{item.name} to category #{abc_category}"
      item.update(abc_category: abc_category)
    end
  end

  ##
  # Get SUM of total orders of Items
  # @param attribute (Symbol) - total_amount_cents or quantity
  # @return Integer
  def total_item_orders(attribute = :total_amount_cents)
    items.map {|item| item.total_orders(attribute: attribute)}.sum
  end

  ##
  # Return SUM of costs of all items
  # @return [] - [item.name, item.costs]
  def total_item_costs
    items.map do |item|
      [item.name, item.datasheet_lines.sum(:cost_cents)]
    end
  end

  ##
  # Return hash with sales information (total_amount) by date period
  # e.g { name: "Item", data: { "Jan" => 10, "Feb" => 15, "Mar" => 25 } }
  # @return Object
  def sales_performance_quantity
    items.includes(order_items: :order).map do |item|
      {
        name: item.name,
        data: item.sales_performance_by_item({ attribute: :quantity }).to_h # Convert sales performance to a hash for Chartkick
      }
    end
  end

  ##
  # Return hash with revenue by Category
  # @return Object
  def revenue_by_category
    values = categories.map do |category|
      {
        name: category.name,
        total: Money.new(category.total_sold).to_f
      }
    end

    [{ name: 'Total', data: values.map { |item| [item[:name], item[:total]] } }]
  end

  ##
  # Return hash with sales information (total_amount) by date period
  # e.g { name: "Item", data: { "price" => 10, "cost" => 15 } }
  # @return Object
  def price_vs_costs
    values = items.map do |item|
      {
        name: item.name,
        price: Money.new(item.customer_price_cents).to_f,
        cost: Money.new(item.costs).to_f
      }
    end

    [{ name: 'Cost', data: values.map { |item| [item[:name], item[:cost]] } },
     { name: 'Price', data: values.map { |item| [item[:name], item[:price]] } }]
  end


  ##
  # Return hash with sales information (total_amount) by date period
  # e.g { name: "Item", data: { "price" => 10, "cost" => 15 } }
  # @return Object
  def costs_vs_profit
    values = items.map do |item|
      {
        name: item.name,
        cost: Money.new(item.costs).to_f,
        price: Money.new(item.customer_price_cents).to_f,
        profit: Money.new(item.profit).to_f
      }
    end

    [{ name: 'Cost', data: values.map { |item| [item[:name], item[:cost]] } },
     { name: 'Price', data: values.map { |item| [item[:name], item[:price]] } },
     { name: 'Profit', data: values.map { |item| [item[:name], item[:profit]] } }]
  end
end

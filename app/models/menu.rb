class Menu < ApplicationRecord
  belongs_to :organization, class_name: 'Organization'
  has_many :items, class_name: 'Item'

  validates :name, :organization_id, presence: true

  def ranking_items
    start_date = Date.today.beginning_of_month
    end_date = Date.today.end_of_month

    items.joins(order_items: :order)
         .where(orders: { date: start_date..end_date })
         .group('items.id')
         .select('items.*, SUM(order_items.quantity) AS total_quantity, SUM(order_items.total_amount_cents) AS total_order_amount')
         .order('total_order_amount DESC, total_quantity DESC')
  end

  ##
  # Get SUM of total orders of Items
  # @param attribute (Symbol) - total_amount_cents or quantity
  # @return Integer
  def total_item_orders(attribute = :total_amount_cents)
    items.map {|item|item.total_orders(attribute: attribute)}.sum
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

  def price_vs_costs
    values = items.map do |item|
      {
        name: item.name,
        price: Money.new(item.customer_price_cents).to_f,
        cost: Money.new(item.costs).to_f
      }
    end

    [{
       name: "Cost",
       data: values.map { |item| [item[:name], item[:cost]] }
     },
     {
        name: "Price",
        data: values.map { |item| [item[:name], item[:price]] }
      }
    ]
  end
end

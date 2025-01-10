class Menu < ApplicationRecord
  belongs_to :organization, class_name: 'Organization'
  has_many :items, class_name: 'Item'

  validates :name, :organization_id, presence: true


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
end

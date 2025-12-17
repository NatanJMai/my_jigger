class Category < ApplicationRecord
  belongs_to :organization, class_name: 'Organization'

  has_many :items, class_name: 'Item', dependent: :destroy
  has_many :orders, through: :items, class_name: 'Order'
  validates :name, :organization_id, presence: true

  ##
  # Return active Categories
  # @return Scope
  scope :active, lambda {
    where(status: true)
  }

  ##
  # Return sum of sold Items
  # OPTIMIZED: Uses database aggregation to avoid N+1 queries
  # @return Integer
  def quantity_sold
    OrderItem
      .joins(:item)
      .where(items: { category_id: self.id })
      .sum(:quantity)
  end

  ##
  # Return sum of sold Items (value)
  # OPTIMIZED: Uses database aggregation to avoid N+1 queries
  # @return Integer
  def total_sold
    OrderItem
      .joins(:item)
      .where(items: { category_id: self.id })
      .sum(:total_amount_cents)
  end

  ##
  # Return nr of items
  # @return Integer
  def number_items
    items.count
  end

  ##
  # Return hash with sales information (total_amount) by date period
  # e.g { name: "Item", data: { "Jan" => 10, "Feb" => 15, "Mar" => 25 } }
  # @return Object
  def sales_performance
    items.includes(order_items: :order).map do |item|
      {
        name: item.name,
        data: item.sales_performance_by_item({ attribute: :total_amount_cents }).to_h # Convert sales performance to a hash for Chartkick
      }
    end
  end

  ##
  # Return category name as string
  # @return String
  def to_s
    name
  end
end

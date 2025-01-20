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
  # @return Integer
  def quantity_sold
    items.map { |item| item.total_orders(attribute: :quantity) }.sum
  end

  ##
  # Return sum of sold Items (value)
  # @return Integer
  def total_sold
    items.map { |item| item.total_orders(attribute: :total_amount_cents) }.sum
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

  def to_s
    name
  end
end

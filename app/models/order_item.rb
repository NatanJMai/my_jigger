class OrderItem < ApplicationRecord
  belongs_to :order, class_name: 'Order'
  belongs_to :item, class_name: 'Item'

  validates :item_id, presence: true
  monetize :unit_price_cents, allow_nil: true
  monetize :total_amount_cents, allow_nil: true

  before_save :set_total_amount

  ##
  # Return order item as string (item name)
  # @return String
  def to_s
    item.name
  end

  ##
  # Define those attributes that we can update from import files.
  # @return Array
  def self.permitted_methods
    %i[quantity]
  end

  private
  def set_total_amount
    self.unit_price_cents = item.customer_price_cents
    self.total_amount_cents = (quantity * item.customer_price_cents).to_i
  end
end

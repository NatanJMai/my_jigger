class OrderItem < ApplicationRecord
  belongs_to :order, class_name: 'Order'
  belongs_to :item, class_name: 'Item'

  validates :item_id, presence: true
  monetize :unit_price_cents, allow_nil: true
  monetize :total_amount_cents, allow_nil: true

  before_save :set_total_amount

  ##
  # Return Item Name
  # @return String
  def to_s
    item.name
  end

  ##
  # Define those attributes that we can update from import files.
  # @return Array
  def self.permitted_methods
    %i[quantity unit_price total_amount]
  end

  private
  def set_total_amount
    self.total_amount_cents = (quantity * unit_price_cents).to_i
  end
end

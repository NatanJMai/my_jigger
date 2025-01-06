class OrderItem < ApplicationRecord
  belongs_to :order, class_name: 'Order'
  belongs_to :item, class_name: 'Item'

  validates :order_id, :item_id, presence: true
  monetize :unit_price_cents, allow_nil: true
  monetize :total_amount_cents, allow_nil: true

  ##
  # Define those attributes that we can update from import files.
  # @return Array
  def self.permitted_methods
    %i[quantity unit_price total_amount]
  end
end

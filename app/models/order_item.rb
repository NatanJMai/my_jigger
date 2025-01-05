class OrderItem < ApplicationRecord
  belongs_to :order, class_name: 'Order'
  belongs_to :item, class_name: 'Item'

  validates :organization_id, :item_id, presence: true
  monetize :unit_price_cents, allow_nil: true
end

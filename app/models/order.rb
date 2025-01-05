class Order < ApplicationRecord
  belongs_to :organization, class_name: 'Organization'
  has_many :order_items, class_name: 'OrderItem'

  validates :order_number, :date, :organization_id, presence: true
  monetize :total_amount_cents, allow_nil: true
end

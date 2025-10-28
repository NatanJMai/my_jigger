class Order < ApplicationRecord
  belongs_to :organization, class_name: 'Organization'
  has_many :order_items, class_name: 'OrderItem', dependent: :destroy
  has_many :items, through: :order_items, class_name: 'Item'

  validates :order_number, :date, :organization_id, presence: true

  accepts_nested_attributes_for :order_items,
                                allow_destroy: true,
                                reject_if: :all_blank

  ##
  # Define those attributes that we can update from import files.
  # @return Array
  def self.permitted_methods
    %i[order_number date total_amount]
  end

  ##
  # Get sum of Order Items cents
  # @return Integer
  def total_amount
    order_items.sum(&:total_amount_cents)
  end
end

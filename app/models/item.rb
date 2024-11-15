class Item < ApplicationRecord
  include ClassyEnum::ActiveRecord
  monetize :customer_price_cents, allow_nil: true
  monetize :purchase_price_cents, allow_nil: true

  classy_enum_attr :unit

  belongs_to :category, class_name: 'Category'

  has_many :datasheets, class_name: 'Datasheet', dependent: :destroy
  validates :name, :category_id, presence: true

  ##
  # Return best five items
  # @return Scope
  scope :best_five, lambda {
    where(status: true).limit(5)
  }
end

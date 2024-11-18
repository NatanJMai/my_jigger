class Item < ApplicationRecord
  include ClassyEnum::ActiveRecord
  monetize :customer_price_cents, allow_nil: true
  monetize :purchase_price_cents, allow_nil: true

  classy_enum_attr :unit, class_name: 'Unit'

  belongs_to :menu, class_name: 'Menu'
  belongs_to :category, class_name: 'Category', optional: true

  has_one :datasheet, class_name: 'Datasheet', dependent: :destroy
  validates :name, :menu, presence: true

  ##
  # Return best five items
  # @return Scope
  scope :best_five, lambda {
    where(status: true).limit(5)
  }
end

class Item < ApplicationRecord
  include ClassyEnum::ActiveRecord
  monetize :customer_price_cents, allow_nil: true
  monetize :purchase_price_cents, allow_nil: true

  belongs_to :menu, class_name: 'Menu', optional: true
  belongs_to :organization, class_name: 'Organization'
  belongs_to :category, class_name: 'Category', optional: true

  has_one :datasheet, class_name: 'Datasheet', dependent: :destroy
  has_many :ingredients, class_name: 'Ingredient', dependent: :destroy
  validates :name, :organization_id, presence: true


  ##
  # Return best five items
  # @return Scope
  scope :best_five, lambda {
    where(status: true).limit(5)
  }
end

class Ingredient < ApplicationRecord
  include ClassyEnum::ActiveRecord
  monetize :cost_cents, allow_nil: true

  classy_enum_attr :unit, class_name: 'Unit'

  belongs_to :item, class_name: 'Item'
  validates :name, :item, presence: true

end

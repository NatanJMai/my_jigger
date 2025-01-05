# frozen_string_literal: true
class DatasheetLine < ApplicationRecord
  belongs_to :datasheet, class_name: 'Datasheet'
  belongs_to :ingredient, class_name: 'Ingredient', optional: true
  validates :datasheet_id, presence: true

  accepts_nested_attributes_for :ingredient

  monetize :cost_cents, as: :cost

  def calculated_price
    return 0 unless volume && quantity && cost

    (quantity.to_f / volume) * cost
  end
end

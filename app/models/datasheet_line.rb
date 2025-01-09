# frozen_string_literal: true
class DatasheetLine < ApplicationRecord
  belongs_to :datasheet, class_name: 'Datasheet'
  belongs_to :ingredient, class_name: 'Ingredient', optional: true
  validates :datasheet_id, presence: true

  accepts_nested_attributes_for :ingredient

  before_save :titleize_name

  monetize :cost_cents, as: :cost

  def calculated_price
    return 0 unless volume && quantity && cost_cents

    (quantity.to_f / volume) * cost_cents
  end

  private
  def titleize_name
    self.name = titleize_string(name)
  end
end

# frozen_string_literal: true
class DatasheetLine < ApplicationRecord
  belongs_to :datasheet, class_name: 'Datasheet'
  belongs_to :ingredient, class_name: 'Ingredient'
  validates :datasheet_id, presence: true

  accepts_nested_attributes_for :ingredient

  before_save :titleize_name

  delegate :name, :volume, :cost_cents, :unit, to: :ingredient

  monetize :cost_cents

  ##
  # Calculate price using formula: (quantity / volume) * cost_cents
  # @return Integer
  def calculated_price
    return 0 unless volume && quantity && cost_cents

    (quantity.to_f / volume) * cost_cents
  end

  ##
  # Return quantity from datasheet_line or fallback to ingredient quantity
  # @return Float
  def show_quantity
    self.quantity.present? ? quantity : ingredient.quantity
  end

  private
  def titleize_name
    self.name = titleize_string(name) if name.present?
  end
end

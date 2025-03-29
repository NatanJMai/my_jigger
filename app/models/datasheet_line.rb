# frozen_string_literal: true
class DatasheetLine < ApplicationRecord
  belongs_to :datasheet, class_name: 'Datasheet'
  belongs_to :ingredient, class_name: 'Ingredient'
  validates :datasheet_id, presence: true

  accepts_nested_attributes_for :ingredient

  before_save :titleize_name

  delegate :name, :volume, :cost_cents, to: :ingredient

  monetize :cost_cents

  def calculated_price
    return 0 unless volume && quantity && cost_cents

    (quantity.to_f / volume) * cost_cents
  end

  def show_quantity
    self.quantity.present? ? quantity : ingredient.quantity
  end

  private
  def titleize_name
    self.name = titleize_string(name) if name.present?
  end
end

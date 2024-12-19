# frozen_string_literal: true
class DatasheetLine < ApplicationRecord
  belongs_to :datasheet, class_name: 'Datasheet'

  validates :datasheet_id, presence: true

  monetize :cost_cents, as: :cost

  def calculated_price
    return 0 unless volume && quantity && cost
    (quantity.to_f / volume) * cost
  end
end

# frozen_string_literal: true
class DatasheetLine < ApplicationRecord
  belongs_to :datasheet, class_name: 'Datasheet'

  validates :datasheet_id, presence: true

  ##
  # FIXME fix calc
  def calculated_price
    return unless volume && quantity

    (quantity / volume).to_f * 100
  end
end

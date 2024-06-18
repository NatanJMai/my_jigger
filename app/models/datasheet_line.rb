# frozen_string_literal: true
class DatasheetLine < ApplicationRecord
  belongs_to :datasheet, class_name: 'Datasheet'
  belongs_to :item, class_name: 'Item'

  validates :datasheet_id, :item_id, presence: true

  def calculated_price
    return unless item && quantity

    (quantity / item.volume).to_f * item.purchase_price_cents
  end
end

# frozen_string_literal: true
class DatasheetLine < ApplicationRecord
  belongs_to :datasheet, class_name: "Datasheet"
  belongs_to :product, class_name: "Product"

  validates :datasheet_id, :product_id, presence: true

  def calculated_price
    return unless product && quantity

    (quantity / product.volume).to_f * product.price_cents
  end
end

class DatasheetLine < ApplicationRecord
  belongs_to :datasheet, class_name: "Datasheet"
  belongs_to :product, class_name: "Product"

  validates :datasheet_id, :product_id, presence: true
end

class Datasheet < ApplicationRecord
  belongs_to :item, class_name: "Item"

  has_many :datasheet_lines, class_name: "DatasheetLine", dependent: :destroy
  validates :name, :item_id, presence: true
end

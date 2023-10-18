class Product < ApplicationRecord
  belongs_to :organization, class_name: "Organization"

  has_many :datasheet_lines, class_name: "DatasheetLine", dependent: :destroy
  validates :name, :organization_id, presence: true
  enum :unit, %i(ml liter g kg und)
end

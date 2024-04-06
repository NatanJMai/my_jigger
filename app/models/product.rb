class Product < ApplicationRecord
  include ClassyEnum::ActiveRecord

  monetize :price_cents, allow_nil: true
  classy_enum_attr :unit


  belongs_to :organization, class_name: "Organization"
  has_many :datasheet_lines, class_name: "DatasheetLine", dependent: :destroy
  validates :name, :organization_id, presence: true
end

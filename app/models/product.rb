class Product < ApplicationRecord
  belongs_to :organization, class_name: "Organization"

  validates :name, :organization_id, presence: true
  enum :unit, %i(ml liter g kg und)
end

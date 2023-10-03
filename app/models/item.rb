class Item < ApplicationRecord
  belongs_to :menu_section, class_name: "MenuSection", optional: true
  belongs_to :organization, class_name: "Organization"

  validates :name, :organization_id, presence: true
end

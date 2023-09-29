class Menu < ApplicationRecord
  belongs_to :organization, class_name: "Organization"
  has_many :menu_sections, class_name: "MenuSection", dependent: :destroy

  validates :name, :organization_id, presence: true
end

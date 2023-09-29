class MenuSection < ApplicationRecord
  belongs_to :menu, class_name: "Menu"

  validates :name, :menu_id, presence: true
end

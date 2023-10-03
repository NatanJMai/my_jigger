class MenuSection < ApplicationRecord
  belongs_to :menu, class_name: "Menu"
  has_many :items, class_name: "Item", dependent: :destroy

  validates :name, :menu_id, presence: true
end

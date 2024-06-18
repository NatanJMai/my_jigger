class Menu < ApplicationRecord
  belongs_to :organization, class_name: 'Organization'
  has_many :menu_items, class_name: 'MenuItem'
  has_many :items, through: :menu_items

  validates :name, :organization_id, presence: true
end

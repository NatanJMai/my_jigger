class MenuItem < ApplicationRecord
  belongs_to :item, class_name: 'Item'
  belongs_to :menu, class_name: 'Menu'

  validates :item_id, :menu_id, presence: true
end

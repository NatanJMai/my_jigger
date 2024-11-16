class Menu < ApplicationRecord
  belongs_to :organization, class_name: 'Organization'
  has_many :items, class_name: 'Item'

  validates :name, :organization_id, presence: true

end

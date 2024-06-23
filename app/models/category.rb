class Category < ApplicationRecord
  belongs_to :organization, class_name: 'Organization'

  has_many :items, class_name: 'Item', dependent: :destroy
  validates :name, :organization_id, presence: true
end

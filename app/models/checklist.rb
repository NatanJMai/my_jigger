class Checklist < ApplicationRecord
  belongs_to :department, class_name: 'Department'
  has_many :checklist_items, class_name: 'ChecklistItem', dependent: :destroy
  validates :name, :department_id, presence: true


end
class ChecklistItem < ApplicationRecord
  include ClassyEnum::ActiveRecord
  belongs_to :checklist, class_name: 'Checklist'
  validates :name, :status, :priority, :checklist_id, presence: true

  classy_enum_attr :priority
  classy_enum_attr :status, enum: :item_status

end
class Department < ApplicationRecord
  belongs_to :organization, class_name: "Organization"
  validates :name, :organization_id, presence: true
end

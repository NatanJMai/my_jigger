class Department < ApplicationRecord
  belongs_to :organization, class_name: "Organization"

  has_many :roles, class_name: "Role"
  validates :name, :organization_id, presence: true
end

class UserRole < ApplicationRecord
  belongs_to :user, class_name: "User"
  belongs_to :role, class_name: "Role"

  validates :user_id, :role_id, presence: true
end

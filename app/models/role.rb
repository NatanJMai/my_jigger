class Role < ApplicationRecord
  belongs_to :department, class_name: "Department"
  has_many :user_roles, class_name: "UserRole"
  has_many :users, through: :user_roles

  validates :name, :department_id, presence: true
end

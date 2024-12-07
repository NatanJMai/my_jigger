class Organization < ApplicationRecord
  belongs_to :manager, class_name: 'User'
  has_many :menus, class_name: 'Menu', dependent: :destroy
  has_many :user_organizations, class_name: 'UserOrganization', dependent: :destroy
  has_many :employees, through: :user_organizations, source: :user
  has_many :categories, class_name: 'Category', dependent: :destroy
  has_many :import_jobs, class_name: 'ImportJob', dependent: :destroy

  before_save { email.downcase! }

  validates :name, presence: true
  validates :manager_id, presence: true
  validates :email, presence: true, length: { maximum: 255 }
  validates :email, format: { with: VALID_EMAIL_REGEX }, uniqueness: true
end

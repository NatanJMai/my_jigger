class UserOrganization < ApplicationRecord
  belongs_to :user, class_name: 'User'
  belongs_to :organization, class_name: 'Organization'

  validates :user_id, :organization_id, presence: true
end

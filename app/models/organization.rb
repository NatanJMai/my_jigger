class Organization < ApplicationRecord
  belongs_to :manager,    class_name: "User"
  has_many :departments,  class_name: "Department", dependent: :destroy

  before_save { email.downcase! }

  validates :name, presence: true
  validates :manager_id, presence: true
  validates :email, presence: true, length: {maximum: 255}
  validates :email, format: { with: VALID_EMAIL_REGEX }, uniqueness: true
end

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  before_save { email.downcase! }

  validates :email, presence: true, length: { maximum: 255 }
  validates :email, format: { with: VALID_EMAIL_REGEX }, uniqueness: true

  has_many :organizations, foreign_key: 'manager_id', class_name: 'Organization', dependent: :destroy

  has_many :user_organizations, class_name: 'UserOrganization', dependent: :destroy
  has_many :employers, through: :user_organizations, source: :organization

  private
    def full_name
    end
end

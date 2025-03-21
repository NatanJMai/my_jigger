class Organization < ApplicationRecord
  belongs_to :manager, class_name: 'User'
  has_many :menus, class_name: 'Menu', dependent: :destroy
  has_many :items, class_name: 'Item', dependent: :destroy
  has_many :ingredients, through: :items, class_name: 'Ingredient'
  has_many :user_organizations, class_name: 'UserOrganization', dependent: :destroy
  has_many :employees, through: :user_organizations, source: :user
  has_many :categories, class_name: 'Category', dependent: :destroy
  has_many :import_jobs, class_name: 'ImportJob', dependent: :destroy
  has_many :orders, class_name: 'Order', dependent: :destroy

  mount_uploader :image, ImageUploader

  before_save { email.downcase! }

  validates :name, presence: true
  validates :manager_id, presence: true
  validates :email, presence: true, length: { maximum: 255 }
  validates :email, format: { with: VALID_EMAIL_REGEX }, uniqueness: true

  ##
  # Find Item by name
  # @param product_name
  # @return Item
  def find_closest_item_or_create(product_name)
    normalized_input = normalize_string(product_name)

    item = items.find_by(normalized_name: normalized_input)

    unless item.present?
      item = items.create(name: normalized_input,
                          category: categories.first,
                          menu_id: self.menus.first.id,
                          data_imported: true)
    end

    item
  end
end

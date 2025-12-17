class Organization < ApplicationRecord
  belongs_to :manager, class_name: 'User'
  has_many :menus, class_name: 'Menu', dependent: :destroy
  has_many :items, class_name: 'Item', dependent: :destroy
  has_many :ingredients, class_name: 'Ingredient'
  has_many :user_organizations, class_name: 'UserOrganization', dependent: :destroy
  has_many :employees, through: :user_organizations, source: :user
  has_many :categories, class_name: 'Category', dependent: :destroy
  has_many :import_jobs, class_name: 'ImportJob', dependent: :destroy
  has_many :orders, class_name: 'Order', dependent: :destroy
  has_many :ai_prompt_logs, through: :menus, class_name: 'AiPromptLog', dependent: :destroy

  mount_uploader :image, ImageUploader

  before_save { email.downcase! }

  validates :name, presence: true
  validates :manager_id, presence: true
  validates :email, presence: true, length: { maximum: 255 }
  validates :email, format: { with: VALID_EMAIL_REGEX }, uniqueness: true

  ##
  # Find Item by name or create if not found
  # @param product_name String - Name of the product
  # @return Item
  def find_closest_item_or_create(product_name)
    normalized_input = normalize_string(product_name)

    item = items.find_by(normalized_name: normalized_input)

    unless item.present?
      item = items.create(name: normalized_input,
                          category: categories.first,
                          menu_id: self.menus.first.id,
                          status: true,
                          data_imported: true)
    end

    item
  end

  ##
  # Find Ingredient by name or create if not found
  # @param ingredient_name String - Name of the ingredient
  # @return Ingredient
  def find_closest_ingredient_or_create(ingredient_name)
    normalized_input = normalize_string(ingredient_name)
    ingredients.find_or_create_by(name: titleize_string(normalized_input))
  end
end

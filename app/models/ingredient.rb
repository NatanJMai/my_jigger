class Ingredient < ApplicationRecord
  include ClassyEnum::ActiveRecord
  monetize :cost_cents, allow_nil: true
  classy_enum_attr :unit, class_name: 'Unit'
  mount_uploader :image, ImageUploader

  has_many :datasheet_lines, class_name: 'DatasheetLine', dependent: :destroy

  belongs_to :organization, class_name: 'Organization'

  before_save :titleize_name
  validates :name, presence: true

  ##
  # Define those attributes that we can update from import files.
  # @return Array
  def self.permitted_methods
    %i[name unit quantity volume cost_cents cost]
  end

  def self.calculated_price(volume, quantity, cost_cents)
    return 0 unless volume && quantity && cost_cents
    return 0 if [volume, quantity, cost_cents].any?{|a| a.negative?}

    (quantity.to_f / volume) * cost_cents
  end

  private
  def titleize_name
    self.name = titleize_string(name)
  end
end

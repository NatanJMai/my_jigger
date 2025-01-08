class Ingredient < ApplicationRecord
  include ClassyEnum::ActiveRecord
  monetize :cost_cents, allow_nil: true

  classy_enum_attr :unit, class_name: 'Unit'

  before_save :titleize_name
  validates :name, presence: true

  ##
  # Define those attributes that we can update from import files.
  # @return Array
  def self.permitted_methods
    %i[name unit quantity volume cost_cents cost]
  end

  private
  def titleize_name
    self.name = titleize_string(name)
  end
end

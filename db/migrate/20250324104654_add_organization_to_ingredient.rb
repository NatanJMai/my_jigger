class AddOrganizationToIngredient < ActiveRecord::Migration[7.1]
  def change
    add_reference :ingredients, :organization, index: true
  end
end

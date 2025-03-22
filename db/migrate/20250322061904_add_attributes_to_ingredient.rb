class AddAttributesToIngredient < ActiveRecord::Migration[7.1]
  def change
    add_column :ingredients, :image, :string
    add_column :ingredients, :prep_method, :text
  end
end

class AddAbcCategoryItem < ActiveRecord::Migration[7.1]
  def change
    add_column :items, :abc_category, :string
  end
end

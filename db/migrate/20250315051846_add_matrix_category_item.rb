class AddMatrixCategoryItem < ActiveRecord::Migration[7.1]
  def change
    add_column :items, :matrix_category, :string
  end
end

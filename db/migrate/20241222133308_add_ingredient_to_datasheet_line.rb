class AddIngredientToDatasheetLine < ActiveRecord::Migration[7.1]
  def change
    add_reference :datasheet_lines, :ingredient, index: true
  end
end

class CreateDatasheetLines < ActiveRecord::Migration[7.1]
  def change
    create_table :datasheet_lines do |t|
      t.references :datasheet, null: false
      t.references :item
      t.float :quantity

      t.timestamps
    end
  end
end

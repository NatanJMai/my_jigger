class CreateDatasheetLine < ActiveRecord::Migration[7.0]
  def change
    create_table :datasheet_lines do |t|
      t.references :datasheet, index: true, foreign_key: { to_table: :datasheets }
      t.references :product, index: true, foreign_key: { to_table: :products }
      t.float :quantity
      t.timestamps
    end
  end
end

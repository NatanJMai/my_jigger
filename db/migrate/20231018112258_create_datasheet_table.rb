class CreateDatasheetTable < ActiveRecord::Migration[7.0]
  def change
    create_table :datasheets do |t|
      t.string :name, index: true
      t.references :item, index: true, foreign_key: { to_table: :items }
      t.boolean :status
      t.timestamps
    end

    add_index :datasheets, [:name, :item_id], unique: true
  end
end

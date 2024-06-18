class CreateTableMenuItem < ActiveRecord::Migration[7.1]
  def change
    create_table :menu_items do |t|
      t.references :menu, foreign_key: true
      t.references :item, foreign_key: true
      t.boolean :status
      t.timestamps
    end
    add_index :menu_items, [:menu_id, :item_id], unique: true
  end
end

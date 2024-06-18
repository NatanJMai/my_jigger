class AddAttributesToItem < ActiveRecord::Migration[7.1]
  def change
    add_reference :items, :category, index: true, foreign_key: { to_table: :categories }, null: false
    add_column :items, :unit, :string
    add_column :items, :volume, :float
    add_column :items, :prep_method, :text
    add_column :items, :best_before, :date
    add_column :items, :image, :string
    add_column :items, :data_imported, :boolean
    add_monetize :items, :purchase_price
    add_monetize :items, :customer_price

    add_index :items, [:category_id, :name], unique: true
  end
end

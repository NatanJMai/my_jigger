class AddIngredientTable < ActiveRecord::Migration[7.1]
  def change
    create_table :ingredients do |t|
      t.references :item, index: true
      t.string :name
      t.string :unit
      t.float :quantity
      t.float :volume
      t.monetize :cost

      t.timestamps
    end
  end
end

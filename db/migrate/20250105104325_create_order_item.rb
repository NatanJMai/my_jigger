class CreateOrderItem < ActiveRecord::Migration[7.1]
  def change
    create_table :order_items do |t|
      t.references :order, index: true, foreign_key: true, null: false
      t.references :item, index: true, foreign_key: true, null: false
      t.integer :quantity
      t.monetize :unit_price

      t.timestamps
    end
  end
end

class CreateOrderTable < ActiveRecord::Migration[7.1]
  def change
    create_table :orders do |t|
      t.references :organization, index: true
      t.bigint :order_number, index: true
      t.datetime :date, index: true
      t.monetize :total_amount
      t.boolean :data_imported

      t.timestamps
    end
  end
end

class AddPriceToProduct < ActiveRecord::Migration[7.1]
  def change
    change_table :products do |t|
      t.monetize :price
    end
  end
end

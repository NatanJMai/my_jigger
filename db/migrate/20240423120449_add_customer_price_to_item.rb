class AddCustomerPriceToItem < ActiveRecord::Migration[7.1]
  change_table :items do |t|
    t.monetize :customer_price
  end
end

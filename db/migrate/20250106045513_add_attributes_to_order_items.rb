class AddAttributesToOrderItems < ActiveRecord::Migration[7.1]
  def change
    add_monetize :order_items, :total_amount
    remove_monetize :orders, :total_amount
  end
end

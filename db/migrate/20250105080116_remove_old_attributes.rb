class RemoveOldAttributes < ActiveRecord::Migration[7.1]
  def change
    remove_column :items, :unit
    remove_column :items, :volume
    remove_column :items, :best_before
    remove_column :items, :purchase_price_cents
    remove_column :items, :purchase_price_currency
  end
end

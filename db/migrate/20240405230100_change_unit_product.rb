class ChangeUnitProduct < ActiveRecord::Migration[7.1]
  def change
    remove_column :products, :unit, :integer
    add_column :products, :unit, :string

  end
end

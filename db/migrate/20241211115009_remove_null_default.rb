class RemoveNullDefault < ActiveRecord::Migration[7.1]
  def change
    change_column :items, :category_id, :integer, null: true
  end
end

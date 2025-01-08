class ChangeUniqueConstraintOnItems < ActiveRecord::Migration[7.1]
  def change
    remove_index :items, name: 'index_items_on_category_id_and_name'
    add_index :items, [:organization_id, :name], unique: true

  end
end

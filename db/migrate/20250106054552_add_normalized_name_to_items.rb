class AddNormalizedNameToItems < ActiveRecord::Migration[7.1]
  def change
    add_column :items, :normalized_name, :string
  end
end

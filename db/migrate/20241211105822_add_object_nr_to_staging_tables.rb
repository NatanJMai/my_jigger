class AddObjectNrToStagingTables < ActiveRecord::Migration[7.1]
  def change
    add_column :staging_tables, :object_number, :integer
    add_index :staging_tables, :object_number
  end
end

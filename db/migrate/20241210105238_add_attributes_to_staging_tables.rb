class AddAttributesToStagingTables < ActiveRecord::Migration[7.1]
  def change
    add_column :staging_tables, :row_data, :string
    add_column :staging_tables, :data_type, :string
    add_column :staging_tables, :attribute_name, :string
    add_column :staging_tables, :reference_key, :integer
    remove_column :staging_tables, :import_status
  end
end

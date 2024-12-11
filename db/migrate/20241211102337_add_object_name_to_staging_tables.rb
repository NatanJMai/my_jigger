class AddObjectNameToStagingTables < ActiveRecord::Migration[7.1]
  def change
    add_column :import_jobs, :reference_name, :string, default: 'NEW OBJECT'
    add_column :import_jobs, :reference_key, :integer
    remove_column :staging_tables, :reference_key, :integer
    add_index :import_jobs, :reference_name
    add_index :import_jobs, :reference_key
  end
end

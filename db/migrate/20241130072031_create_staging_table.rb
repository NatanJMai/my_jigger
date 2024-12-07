class CreateStagingTable < ActiveRecord::Migration[7.1]
  def change
    create_table :staging_tables do |t|
      t.references :import_job, index: true
      t.datetime :date
      t.string :import_status
      t.string :staging_table
      t.string :staging_status

      t.timestamps
    end
  end
end

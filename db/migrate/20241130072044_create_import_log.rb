class CreateImportLog < ActiveRecord::Migration[7.1]
  def change
    create_table :import_logs do |t|
      t.references :import_job, index: true
      t.datetime :date
      t.string :message
      t.string :log_type

      t.timestamps
    end
  end
end

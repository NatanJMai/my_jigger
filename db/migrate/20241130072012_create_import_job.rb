class CreateImportJob < ActiveRecord::Migration[7.1]
  def change
    create_table :import_jobs do |t|
      t.datetime :date
      t.references :organization, index: true
      t.references :user, index: true
      t.string :file
      t.string :import_status

      t.timestamps
    end
  end
end

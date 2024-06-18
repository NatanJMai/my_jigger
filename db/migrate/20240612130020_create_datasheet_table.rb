class CreateDatasheetTable < ActiveRecord::Migration[7.1]
  def change
    create_table :datasheets do |t|
      t.references :item, null: false, foreign_key: true
      t.string :name, null: false
      t.boolean :status

      t.timestamps
    end
  end
end

class CreateTableMenu < ActiveRecord::Migration[7.0]
  def change
    create_table :menus do |t|
      t.string :name
      t.references :organization, index: true
      t.date :release_date
      t.text :description
      t.boolean :status
      t.timestamps
    end
  end
end

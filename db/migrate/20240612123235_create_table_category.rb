class CreateTableCategory < ActiveRecord::Migration[7.1]
  def change
    create_table :categories do |t|
      t.string :name, null: false
      t.references :organization, index: true, foreign_key: true
      t.text :description
      t.boolean :status

      t.timestamps
    end
  end
end

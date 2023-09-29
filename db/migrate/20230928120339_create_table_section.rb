class CreateTableSection < ActiveRecord::Migration[7.0]
  def change
    create_table :menu_sections do |t|
      t.string :name
      t.references :menu, index: true
      t.boolean :status
      t.timestamps
    end
  end
end

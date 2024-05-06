class AddChecklistTable < ActiveRecord::Migration[7.1]
  def change
    create_table :checklists do |t|
      t.string :name, index: true
      t.references :department, index: true
      t.date :date
      t.text :description

      t.timestamps
    end
  end
end

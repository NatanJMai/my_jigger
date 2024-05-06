class AddChecklistItemTable < ActiveRecord::Migration[7.1]
  def change
    create_table :checklist_items do |t|
      t.string :name, index: true
      t.references :checklist, index: true
      t.string :priority
      t.string :status
      t.timestamps
    end
  end
end

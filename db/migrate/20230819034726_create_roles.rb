class CreateRoles < ActiveRecord::Migration[7.0]
  def change
    create_table :roles do |t|
      t.references :organization, index: true, foreign_key: {to_table: :organizations}
      t.references :department, index: true, foreign_key: {to_table: :departments}
      t.string :name
      t.text :description
      t.integer :permission
      t.boolean :status
      t.timestamps
    end

    add_index :roles, [:organization_id, :department_id, :name], unique: true
  end
end

class CreateDepartments < ActiveRecord::Migration[7.0]
  def change
    create_table :departments do |t|
      t.string :name
      t.text :description
      t.boolean :status
      t.references :organization, index: true, foreign_key: {to_table: :organizations}
      t.timestamps
    end
  end
end

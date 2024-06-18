class CreateOrganizations < ActiveRecord::Migration[7.0]
  def change
    create_table :organizations do |t|
      t.string :name
      t.string :address
      t.string :site
      t.string :phone
      t.string :email
      t.references :manager, index: true, foreign_key: { to_table: :users }
      t.boolean :status

      t.timestamps
    end
  end
end

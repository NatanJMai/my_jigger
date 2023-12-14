class AddOrganizationToItem < ActiveRecord::Migration[7.0]
  def change
    add_reference :items, :organization, index: true, foreign_key: {to_table: :organizations}
    add_index :items, [:organization_id, :name], unique: true
  end
end
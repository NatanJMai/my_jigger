class RemoveOrganizationFromRoles < ActiveRecord::Migration[7.0]
  def change
    remove_column :roles, :organization_id
  end
end

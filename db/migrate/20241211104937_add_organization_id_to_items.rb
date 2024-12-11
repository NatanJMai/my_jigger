class AddOrganizationIdToItems < ActiveRecord::Migration[7.1]
  def change
    add_reference :items, :organization, index: true
  end
end

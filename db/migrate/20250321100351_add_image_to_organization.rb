class AddImageToOrganization < ActiveRecord::Migration[7.1]
  def change
    add_column :organizations, :image, :string
  end
end

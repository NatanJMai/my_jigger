class RemoveIndexFromItems < ActiveRecord::Migration[7.0]
  def change
    remove_reference :items, :section
    add_reference :items, :menu_section
  end
end

class AddMenuToItem < ActiveRecord::Migration[7.1]
  def change
    add_reference :items, :menu, index: true
  end
end

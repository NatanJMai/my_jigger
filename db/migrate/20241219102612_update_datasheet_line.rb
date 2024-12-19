class UpdateDatasheetLine < ActiveRecord::Migration[7.1]
  def change
    remove_column :datasheet_lines, :cost_cents
    add_column :datasheet_lines, :cost_cents, :integer, default: 0, null: false
  end
end

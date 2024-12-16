class UpdateDatasheetLinesTable < ActiveRecord::Migration[7.1]
  def change
    remove_column :datasheet_lines, :item_id
    add_column :datasheet_lines, :name, :string
    add_column :datasheet_lines, :volume, :float
    add_column :datasheet_lines, :unit, :string
    add_monetize :datasheet_lines, :cost
  end
end

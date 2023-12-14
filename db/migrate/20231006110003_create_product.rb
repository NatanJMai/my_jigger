class CreateProduct < ActiveRecord::Migration[7.0]
  def change
    create_table :products do |t|
      t.string :name
      t.references :organization, index: true, foreign_key: { to_table: :organizations }
      t.integer :unit
      t.float :volume
      t.text :prep_method
      t.date :best_before
      t.boolean :status
      t.timestamps
    end

    add_index :products, [:organization_id, :name], unique: true
  end
end

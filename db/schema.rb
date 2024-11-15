# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2024_06_12_130149) do
  # These are extensions that must be enabled in order to support this database
  enable_extension 'plpgsql'

  create_table 'categories', force: :cascade do |t|
    t.string 'name', null: false
    t.bigint 'organization_id'
    t.text 'description'
    t.boolean 'status'
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
    t.index ['organization_id'], name: 'index_categories_on_organization_id'
  end

  create_table 'datasheet_lines', force: :cascade do |t|
    t.bigint 'datasheet_id', null: false
    t.bigint 'item_id'
    t.float 'quantity'
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
    t.index ['datasheet_id'], name: 'index_datasheet_lines_on_datasheet_id'
    t.index ['item_id'], name: 'index_datasheet_lines_on_item_id'
  end

  create_table 'datasheets', force: :cascade do |t|
    t.bigint 'item_id', null: false
    t.string 'name', null: false
    t.boolean 'status'
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
    t.index ['item_id'], name: 'index_datasheets_on_item_id'
  end

  create_table 'items', force: :cascade do |t|
    t.string 'name'
    t.boolean 'status'
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
    t.bigint 'category_id', null: false
    t.string 'unit'
    t.float 'volume'
    t.text 'prep_method'
    t.date 'best_before'
    t.string 'image'
    t.boolean 'data_imported'
    t.integer 'purchase_price_cents', default: 0, null: false
    t.string 'purchase_price_currency', default: 'BRL', null: false
    t.integer 'customer_price_cents', default: 0, null: false
    t.string 'customer_price_currency', default: 'BRL', null: false
    t.index ['category_id', 'name'], name: 'index_items_on_category_id_and_name', unique: true
    t.index ['category_id'], name: 'index_items_on_category_id'
  end

  create_table 'menu_items', force: :cascade do |t|
    t.bigint 'menu_id'
    t.bigint 'item_id'
    t.boolean 'status'
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
    t.index ['item_id'], name: 'index_menu_items_on_item_id'
    t.index ['menu_id', 'item_id'], name: 'index_menu_items_on_menu_id_and_item_id', unique: true
    t.index ['menu_id'], name: 'index_menu_items_on_menu_id'
  end

  create_table 'menus', force: :cascade do |t|
    t.string 'name'
    t.bigint 'organization_id'
    t.date 'release_date'
    t.text 'description'
    t.boolean 'data_imported'
    t.boolean 'status'
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
    t.index ['organization_id'], name: 'index_menus_on_organization_id'
  end

  create_table 'organizations', force: :cascade do |t|
    t.string 'name'
    t.string 'address'
    t.string 'site'
    t.string 'phone'
    t.string 'email'
    t.bigint 'manager_id'
    t.boolean 'status'
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
    t.index ['manager_id'], name: 'index_organizations_on_manager_id'
  end

  create_table 'user_organizations', force: :cascade do |t|
    t.bigint 'user_id'
    t.bigint 'organization_id'
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
    t.index ['organization_id'], name: 'index_user_organizations_on_organization_id'
    t.index ['user_id'], name: 'index_user_organizations_on_user_id'
  end

  create_table 'users', force: :cascade do |t|
    t.string 'email', default: '', null: false
    t.string 'encrypted_password', default: '', null: false
    t.string 'reset_password_token'
    t.datetime 'reset_password_sent_at'
    t.datetime 'remember_created_at'
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
    t.string 'first_name'
    t.string 'last_name'
    t.string 'address'
    t.string 'phone'
    t.boolean 'consultant'
    t.boolean 'status'
    t.index ['email'], name: 'index_users_on_email', unique: true
    t.index ['reset_password_token'], name: 'index_users_on_reset_password_token', unique: true
  end

  add_foreign_key 'categories', 'organizations'
  add_foreign_key 'datasheets', 'items'
  add_foreign_key 'items', 'categories'
  add_foreign_key 'menu_items', 'items'
  add_foreign_key 'menu_items', 'menus'
  add_foreign_key 'organizations', 'users', column: 'manager_id'
  add_foreign_key 'user_organizations', 'organizations'
  add_foreign_key 'user_organizations', 'users'
end

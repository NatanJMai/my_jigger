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

ActiveRecord::Schema[7.1].define(version: 2024_04_23_120449) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "datasheet_lines", force: :cascade do |t|
    t.bigint "datasheet_id"
    t.bigint "product_id"
    t.float "quantity"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["datasheet_id"], name: "index_datasheet_lines_on_datasheet_id"
    t.index ["product_id"], name: "index_datasheet_lines_on_product_id"
  end

  create_table "datasheets", force: :cascade do |t|
    t.string "name"
    t.bigint "item_id"
    t.boolean "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["item_id"], name: "index_datasheets_on_item_id"
    t.index ["name", "item_id"], name: "index_datasheets_on_name_and_item_id", unique: true
    t.index ["name"], name: "index_datasheets_on_name"
  end

  create_table "departments", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.boolean "status"
    t.bigint "organization_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["organization_id"], name: "index_departments_on_organization_id"
  end

  create_table "items", force: :cascade do |t|
    t.string "name"
    t.boolean "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "organization_id"
    t.bigint "menu_section_id"
    t.integer "customer_price_cents", default: 0, null: false
    t.string "customer_price_currency", default: "BRL", null: false
    t.index ["menu_section_id"], name: "index_items_on_menu_section_id"
    t.index ["organization_id", "name"], name: "index_items_on_organization_id_and_name", unique: true
    t.index ["organization_id"], name: "index_items_on_organization_id"
  end

  create_table "menu_sections", force: :cascade do |t|
    t.string "name"
    t.bigint "menu_id"
    t.boolean "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["menu_id"], name: "index_menu_sections_on_menu_id"
  end

  create_table "menus", force: :cascade do |t|
    t.string "name"
    t.bigint "organization_id"
    t.date "release_date"
    t.text "description"
    t.boolean "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["organization_id"], name: "index_menus_on_organization_id"
  end

  create_table "organizations", force: :cascade do |t|
    t.string "name"
    t.string "address"
    t.string "site"
    t.string "phone"
    t.string "email"
    t.bigint "manager_id"
    t.boolean "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["manager_id"], name: "index_organizations_on_manager_id"
  end

  create_table "products", force: :cascade do |t|
    t.string "name"
    t.bigint "organization_id"
    t.float "volume"
    t.text "prep_method"
    t.date "best_before"
    t.boolean "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "price_cents", default: 0, null: false
    t.string "price_currency", default: "BRL", null: false
    t.string "unit"
    t.index ["organization_id", "name"], name: "index_products_on_organization_id_and_name", unique: true
    t.index ["organization_id"], name: "index_products_on_organization_id"
  end

  create_table "roles", force: :cascade do |t|
    t.bigint "department_id"
    t.string "name"
    t.text "description"
    t.integer "permission"
    t.boolean "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["department_id"], name: "index_roles_on_department_id"
  end

  create_table "user_organizations", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "organization_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["organization_id"], name: "index_user_organizations_on_organization_id"
    t.index ["user_id"], name: "index_user_organizations_on_user_id"
  end

  create_table "user_roles", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "role_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["role_id"], name: "index_user_roles_on_role_id"
    t.index ["user_id", "role_id"], name: "index_user_roles_on_user_id_and_role_id", unique: true
    t.index ["user_id"], name: "index_user_roles_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "first_name"
    t.string "last_name"
    t.string "address"
    t.string "phone"
    t.boolean "consultant"
    t.boolean "status"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "datasheet_lines", "datasheets"
  add_foreign_key "datasheet_lines", "products"
  add_foreign_key "datasheets", "items"
  add_foreign_key "departments", "organizations"
  add_foreign_key "items", "organizations"
  add_foreign_key "organizations", "users", column: "manager_id"
  add_foreign_key "products", "organizations"
  add_foreign_key "roles", "departments"
  add_foreign_key "user_organizations", "organizations"
  add_foreign_key "user_organizations", "users"
  add_foreign_key "user_roles", "roles"
  add_foreign_key "user_roles", "users"
end

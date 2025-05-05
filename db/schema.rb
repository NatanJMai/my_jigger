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

ActiveRecord::Schema[7.1].define(version: 2025_05_05_104044) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "ai_prompt_logs", force: :cascade do |t|
    t.bigint "organization_id"
    t.bigint "prompt_type_id"
    t.datetime "date"
    t.jsonb "prompt_input", default: {}, null: false
    t.text "prompt_text"
    t.text "response_text"
    t.integer "tokens"
    t.boolean "success"
    t.text "error_message"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["organization_id"], name: "index_ai_prompt_logs_on_organization_id"
    t.index ["prompt_type_id"], name: "index_ai_prompt_logs_on_prompt_type_id"
  end

  create_table "ai_recommendation_topics", force: :cascade do |t|
    t.string "name"
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_ai_recommendation_topics_on_name"
  end

  create_table "ai_recommendations", force: :cascade do |t|
    t.bigint "ai_recommendation_topic_id"
    t.bigint "organization_id"
    t.datetime "date"
    t.text "message"
    t.string "feedback"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["ai_recommendation_topic_id"], name: "index_ai_recommendations_on_ai_recommendation_topic_id"
    t.index ["organization_id"], name: "index_ai_recommendations_on_organization_id"
  end

  create_table "categories", force: :cascade do |t|
    t.string "name", null: false
    t.bigint "organization_id"
    t.text "description"
    t.boolean "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["organization_id"], name: "index_categories_on_organization_id"
  end

  create_table "datasheet_lines", force: :cascade do |t|
    t.bigint "datasheet_id", null: false
    t.float "quantity"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name"
    t.float "volume"
    t.string "unit"
    t.string "cost_currency", default: "BRL", null: false
    t.integer "cost_cents", default: 0, null: false
    t.bigint "ingredient_id"
    t.index ["datasheet_id"], name: "index_datasheet_lines_on_datasheet_id"
    t.index ["ingredient_id"], name: "index_datasheet_lines_on_ingredient_id"
  end

  create_table "datasheets", force: :cascade do |t|
    t.bigint "item_id", null: false
    t.string "name", null: false
    t.boolean "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["item_id"], name: "index_datasheets_on_item_id"
  end

  create_table "import_jobs", force: :cascade do |t|
    t.datetime "date"
    t.bigint "organization_id"
    t.bigint "user_id"
    t.string "file"
    t.string "import_status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "reference_name", default: "NEW OBJECT"
    t.integer "reference_key"
    t.index ["organization_id"], name: "index_import_jobs_on_organization_id"
    t.index ["reference_key"], name: "index_import_jobs_on_reference_key"
    t.index ["reference_name"], name: "index_import_jobs_on_reference_name"
    t.index ["user_id"], name: "index_import_jobs_on_user_id"
  end

  create_table "import_logs", force: :cascade do |t|
    t.bigint "import_job_id"
    t.datetime "date"
    t.string "message"
    t.string "log_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["import_job_id"], name: "index_import_logs_on_import_job_id"
  end

  create_table "ingredients", force: :cascade do |t|
    t.bigint "item_id"
    t.string "name"
    t.string "unit"
    t.float "quantity"
    t.float "volume"
    t.integer "cost_cents", default: 0, null: false
    t.string "cost_currency", default: "BRL", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "image"
    t.text "prep_method"
    t.bigint "organization_id"
    t.index ["item_id"], name: "index_ingredients_on_item_id"
    t.index ["organization_id"], name: "index_ingredients_on_organization_id"
  end

  create_table "items", force: :cascade do |t|
    t.string "name"
    t.boolean "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "category_id"
    t.text "prep_method"
    t.string "image"
    t.boolean "data_imported"
    t.integer "customer_price_cents", default: 0, null: false
    t.string "customer_price_currency", default: "BRL", null: false
    t.bigint "menu_id"
    t.bigint "organization_id"
    t.string "normalized_name"
    t.string "abc_category"
    t.string "matrix_category"
    t.index ["category_id"], name: "index_items_on_category_id"
    t.index ["menu_id"], name: "index_items_on_menu_id"
    t.index ["organization_id", "name"], name: "index_items_on_organization_id_and_name", unique: true
    t.index ["organization_id"], name: "index_items_on_organization_id"
  end

  create_table "menus", force: :cascade do |t|
    t.string "name"
    t.bigint "organization_id"
    t.date "release_date"
    t.text "description"
    t.boolean "data_imported"
    t.boolean "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["organization_id"], name: "index_menus_on_organization_id"
  end

  create_table "order_items", force: :cascade do |t|
    t.bigint "order_id", null: false
    t.bigint "item_id", null: false
    t.integer "quantity"
    t.integer "unit_price_cents", default: 0, null: false
    t.string "unit_price_currency", default: "BRL", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "total_amount_cents", default: 0, null: false
    t.string "total_amount_currency", default: "BRL", null: false
    t.index ["item_id"], name: "index_order_items_on_item_id"
    t.index ["order_id"], name: "index_order_items_on_order_id"
  end

  create_table "orders", force: :cascade do |t|
    t.bigint "organization_id"
    t.bigint "order_number"
    t.datetime "date"
    t.boolean "data_imported"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["date"], name: "index_orders_on_date"
    t.index ["order_number"], name: "index_orders_on_order_number"
    t.index ["organization_id"], name: "index_orders_on_organization_id"
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
    t.string "image"
    t.index ["manager_id"], name: "index_organizations_on_manager_id"
  end

  create_table "staging_tables", force: :cascade do |t|
    t.bigint "import_job_id"
    t.datetime "date"
    t.string "staging_table"
    t.string "staging_status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "row_data"
    t.string "data_type"
    t.string "attribute_name"
    t.integer "object_number"
    t.index ["import_job_id"], name: "index_staging_tables_on_import_job_id"
    t.index ["object_number"], name: "index_staging_tables_on_object_number"
  end

  create_table "user_organizations", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "organization_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["organization_id"], name: "index_user_organizations_on_organization_id"
    t.index ["user_id"], name: "index_user_organizations_on_user_id"
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

  add_foreign_key "ai_prompt_logs", "ai_recommendation_topics", column: "prompt_type_id"
  add_foreign_key "ai_prompt_logs", "organizations"
  add_foreign_key "ai_recommendations", "ai_recommendation_topics"
  add_foreign_key "ai_recommendations", "organizations"
  add_foreign_key "categories", "organizations"
  add_foreign_key "datasheets", "items"
  add_foreign_key "items", "categories"
  add_foreign_key "order_items", "items"
  add_foreign_key "order_items", "orders"
  add_foreign_key "organizations", "users", column: "manager_id"
  add_foreign_key "user_organizations", "organizations"
  add_foreign_key "user_organizations", "users"
end

# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20151209153425) do

  create_table "case_studies", force: :cascade do |t|
    t.string   "title",                                  null: false
    t.text     "description"
    t.string   "thumbnail"
    t.integer  "template",               default: 1
    t.boolean  "status",                 default: false
    t.datetime "created_at",                             null: false
    t.datetime "updated_at",                             null: false
    t.string   "thumbnail_file_name"
    t.string   "thumbnail_content_type"
    t.integer  "thumbnail_file_size"
    t.datetime "thumbnail_updated_at"
  end

  create_table "contacts", force: :cascade do |t|
    t.string   "name",              null: false
    t.text     "body"
    t.string   "logo"
    t.datetime "created_at",        null: false
    t.datetime "updated_at",        null: false
    t.string   "logo_file_name"
    t.string   "logo_content_type"
    t.integer  "logo_file_size"
    t.datetime "logo_updated_at"
    t.integer  "case_study_id"
  end

  add_index "contacts", ["case_study_id"], name: "index_contacts_on_case_study_id"

  create_table "pages", force: :cascade do |t|
    t.string   "title",                               null: false
    t.text     "body"
    t.integer  "type",                    default: 1
    t.string   "background"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.string   "background_file_name"
    t.string   "background_content_type"
    t.integer  "background_file_size"
    t.datetime "background_updated_at"
    t.integer  "case_study_id"
  end

  add_index "pages", ["case_study_id"], name: "index_pages_on_case_study_id"

end
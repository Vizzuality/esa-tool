class CreateContactForms < ActiveRecord::Migration
  def change
    create_table :contact_forms do |t|
      t.string :name, null: false
      t.string :email, null: false
      t.text :content, null: false
      t.timestamps null: false
    end
  end
end

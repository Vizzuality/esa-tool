class CreateContacts < ActiveRecord::Migration
  def change
    create_table :contacts do |t|
      t.string :name, null: false
      t.text :body
      t.string :logo

      t.timestamps null: false
    end
  end
end

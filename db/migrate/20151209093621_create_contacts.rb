class CreateContacts < ActiveRecord::Migration
  def change
    create_table :contacts do |t|
      t.string :name, null: false
      t.text :body

      t.belongs_to :case_study, index: true, null: false

      t.timestamps null: false
    end
  end
end

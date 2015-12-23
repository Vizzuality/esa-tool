class CreateContacts < ActiveRecord::Migration
  def change
    create_table :contacts do |t|
      t.text :body, null: false

      t.belongs_to :case_study, index: true, null: false

      t.timestamps null: false
    end
  end
end

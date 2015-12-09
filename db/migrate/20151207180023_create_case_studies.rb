class CreateCaseStudies < ActiveRecord::Migration
  def change
    create_table :case_studies do |t|
      t.string :title, null: false
      t.text :description
      t.string :thumbnail
      t.integer :template, default: 1
      t.boolean :status, default: false

      t.timestamps null: false
    end
  end
end

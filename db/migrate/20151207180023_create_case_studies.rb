class CreateCaseStudies < ActiveRecord::Migration
  def change
    create_table :case_studies do |t|
      t.string :title
      t.text :description
      t.string :thumbnail
      t.integer :template
      t.boolean :status

      t.timestamps null: false
    end
  end
end

class CreatePages < ActiveRecord::Migration
  def change
    create_table :pages do |t|
      t.string :title, null: false
      t.text :body_first
      t.text :body_second
      t.text :body_thirth
      t.integer :page_type, default: 1
      t.integer :text_columns, default: 1
      t.integer :color_palette
      t.string :custom_color_palette

      t.belongs_to :case_study, index: true, null: false

      t.timestamps null: false
    end
  end
end

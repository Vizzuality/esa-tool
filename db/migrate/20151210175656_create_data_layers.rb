class CreateDataLayers < ActiveRecord::Migration
  def change
    create_table :data_layers do |t|
      t.string :table_name, null: false
      t.string :import_status, null: false
      t.references :page, index: true, foreign_key: true, null: false

      t.timestamps null: false
    end
  end
end

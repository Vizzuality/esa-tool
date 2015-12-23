class CreateDataLayers < ActiveRecord::Migration
  def change
    create_table :data_layers do |t|
      t.string :table_name, null: false
      t.string :import_status, null: false
      t.belongs_to :page, index: true, null: false

      t.timestamps null: false
    end
  end
end

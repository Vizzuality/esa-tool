class AddColumnFieldToDataLayers < ActiveRecord::Migration
  def change
    add_column :data_layers, :column_selected, :string
  end
end

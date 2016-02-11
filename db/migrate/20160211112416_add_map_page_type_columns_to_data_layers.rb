class AddMapPageTypeColumnsToDataLayers < ActiveRecord::Migration
  def change
    add_column :data_layers, :layer_column, :string
    add_column :data_layers, :layer_column_alias, :string
  end
end

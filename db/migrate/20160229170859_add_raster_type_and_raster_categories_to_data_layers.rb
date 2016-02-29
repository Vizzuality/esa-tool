class AddRasterTypeAndRasterCategoriesToDataLayers < ActiveRecord::Migration
  def change
    add_column :data_layers, :raster_type, :string
    add_column :data_layers, :raster_categories, :string
  end
end

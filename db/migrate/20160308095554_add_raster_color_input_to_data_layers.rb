class AddRasterColorInputToDataLayers < ActiveRecord::Migration
  def change
  	add_column :data_layers, :raster_color_input, :text
  end
end

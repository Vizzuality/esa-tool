class AddRasterColorInput < ActiveRecord::Migration
  def change
  	add_column :data_layers, :raster_color_input, :text, default: 'test'
  end
end

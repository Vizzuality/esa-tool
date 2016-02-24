class AddFileColumnToDataLayers < ActiveRecord::Migration
  def change
    add_attachment :data_layers, :shapefile
  end
end

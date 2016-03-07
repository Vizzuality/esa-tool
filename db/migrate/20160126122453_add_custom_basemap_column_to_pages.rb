class AddCustomBasemapColumnToPages < ActiveRecord::Migration
  def change
    add_column :pages, :raster_custom_colors, :text
  end
end

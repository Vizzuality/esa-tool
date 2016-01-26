class AddCustomBasemapColumnToPages < ActiveRecord::Migration
  def change
    add_column :pages, :custom_basemap, :text
  end
end

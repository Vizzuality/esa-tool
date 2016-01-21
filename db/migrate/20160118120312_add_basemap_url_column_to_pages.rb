class AddBasemapUrlColumnToPages < ActiveRecord::Migration
  def change
    add_column :pages, :basemap_url, :string
  end
end

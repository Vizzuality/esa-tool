class AddMapDefaultBasemapColumn < ActiveRecord::Migration
  def change
    add_column :pages, :basemap, :string
  end
end

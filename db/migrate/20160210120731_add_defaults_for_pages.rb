class AddDefaultsForPages < ActiveRecord::Migration
  def change
    change_column :pages, :basemap, :string, default: 'terrain'
    change_column :pages, :color_palette, :integer, default: 1
  end
end

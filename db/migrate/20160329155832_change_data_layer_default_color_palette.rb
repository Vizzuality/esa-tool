class ChangeDataLayerDefaultColorPalette < ActiveRecord::Migration
  def change
    change_column :pages, :color_palette, :integer, default: 3
  end
end

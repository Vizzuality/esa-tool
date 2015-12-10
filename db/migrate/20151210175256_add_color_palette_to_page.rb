class AddColorPaletteToPage < ActiveRecord::Migration
  def change
    add_column :pages, :sql_query, :text
    add_column :pages, :columns, :string
    add_column :pages, :color_palette, :integer
    add_column :pages, :custom_color_palette, :string
    add_column :pages, :chart_types, :string
  end
end

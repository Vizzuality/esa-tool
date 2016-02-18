class AddCustomColumnsColorToDataLayer < ActiveRecord::Migration
  def change
    add_column :data_layers, :custom_columns_colors, :text
  end
end

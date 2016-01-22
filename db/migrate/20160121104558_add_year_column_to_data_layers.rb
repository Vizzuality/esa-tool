class AddYearColumnToDataLayers < ActiveRecord::Migration
  def change
    add_column :data_layers, :year, :integer
  end
end

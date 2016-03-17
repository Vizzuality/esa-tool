class AddReadyColumnToDataLayer < ActiveRecord::Migration
  def change
    add_column :data_layers, :is_ready, :boolean
  end
end

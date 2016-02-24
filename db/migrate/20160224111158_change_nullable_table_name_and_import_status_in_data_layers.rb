class ChangeNullableTableNameAndImportStatusInDataLayers < ActiveRecord::Migration
  def change
    change_column :data_layers, :table_name, :string, :null => true
    change_column :data_layers, :import_status, :string, :null => true
  end
end

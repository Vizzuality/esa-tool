class AddDefaultValueToImportStatusDataLayer < ActiveRecord::Migration
  def change
    change_column :data_layers, :import_status, :string, default: 'pending'
  end
end

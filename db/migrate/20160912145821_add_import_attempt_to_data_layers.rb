class AddImportAttemptToDataLayers < ActiveRecord::Migration
  def change
    add_column :data_layers, :import_attempt, :integer, default: 0
  end
end

class MoveColumnSelectedToPages < ActiveRecord::Migration
  def change
    remove_column :data_layers, :column_selected
    add_column :pages, :column_selected, :string
  end
end

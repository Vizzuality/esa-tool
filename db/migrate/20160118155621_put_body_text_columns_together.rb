class PutBodyTextColumnsTogether < ActiveRecord::Migration
  def change
    remove_column :pages, :body_first
    remove_column :pages, :body_second
    remove_column :pages, :body_thirth
    add_column :pages, :body, :text
  end
end

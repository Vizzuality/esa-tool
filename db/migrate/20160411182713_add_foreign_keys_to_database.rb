class AddForeignKeysToDatabase < ActiveRecord::Migration
  def change
    add_foreign_key :data_layers, :pages
    add_foreign_key :interest_points, :pages
    add_foreign_key :pages, :case_studies
    add_foreign_key :contacts, :case_studies
  end
end

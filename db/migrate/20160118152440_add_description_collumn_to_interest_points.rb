class AddDescriptionCollumnToInterestPoints < ActiveRecord::Migration
  def change
    add_column :interest_points, :description, :string
  end
end

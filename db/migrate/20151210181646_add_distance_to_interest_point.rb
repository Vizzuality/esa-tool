class AddDistanceToInterestPoint < ActiveRecord::Migration
  def change
    add_column :interest_points, :radius, :float
  end
end

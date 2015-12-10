class AddDistanceToInterestPoint < ActiveRecord::Migration
  def change
    add_column :interest_points, :distance, :float
  end
end

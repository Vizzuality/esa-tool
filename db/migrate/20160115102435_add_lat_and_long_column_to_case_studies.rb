class AddLatAndLongColumnToCaseStudies < ActiveRecord::Migration
  def change
    add_column :case_studies, :lat, :decimal
    add_column :case_studies, :lng, :decimal
  end
end

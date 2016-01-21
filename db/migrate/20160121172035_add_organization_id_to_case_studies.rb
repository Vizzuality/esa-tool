class AddOrganizationIdToCaseStudies < ActiveRecord::Migration
  def change
    add_column :case_studies, :organization_id, :integer
  end
end

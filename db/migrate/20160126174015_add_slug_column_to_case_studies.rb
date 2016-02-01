class AddSlugColumnToCaseStudies < ActiveRecord::Migration
  def change
    add_column :case_studies, :slug, :string
  end
end

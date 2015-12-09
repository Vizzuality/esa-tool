class AddCaseStudyToPages < ActiveRecord::Migration
  def change
    add_reference :pages, :case_study, index: true, foreign_key: true
  end
end

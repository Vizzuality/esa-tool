class AddCaseStudyToContacts < ActiveRecord::Migration
  def change
    add_reference :contacts, :case_study, index: true, foreign_key: true
  end
end

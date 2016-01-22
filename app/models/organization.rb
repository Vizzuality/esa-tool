class Organization < ActiveRecord::Base
  default_scope { order(:name) }

  has_many :case_studies

  validates :name, presence: true
end

class DataLayer < ActiveRecord::Base

  belongs_to :page

  validates :file, presence: true
  validates :year, presence: true

end

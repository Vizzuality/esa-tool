class DataLayer < ActiveRecord::Base

  belongs_to :page

  validates :table_name, presence: true

end

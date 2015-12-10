class InterestPoint < ActiveRecord::Base

  belongs_to :page

  validates :lat, presence: true
  validates :lng, presence: true
  validates :distance, presence: true

end

class InterestPoint < ActiveRecord::Base

  belongs_to :page

  validates :name, presence: true, length: { minimum: 2 }
  validates :lat, presence: true
  validates :lng, presence: true
  validates :radius, presence: true

end

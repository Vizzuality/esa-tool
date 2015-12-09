class CaseStudy < ActiveRecord::Base

  validates :title, presence: true, length: { minimum: 2 }
  validates :template, presence: true, numericality: {
    only_integer: true,
    greater_than_or_equal_to: 1,
    less_than_or_equal_to: 5
  }
  validates :status, presence: true

  has_attached_file :thumbnail, styles: { medium: '385x200>' }

end

class CaseStudy < ActiveRecord::Base

  has_many :contacts
  has_many :pages

  accepts_nested_attributes_for :contacts
  accepts_nested_attributes_for :pages

  validates :title, presence: true, length: { minimum: 2 }
  validates :template, presence: true, numericality: {
    only_integer: true,
    greater_than_or_equal_to: 1,
    less_than_or_equal_to: 5
  }
  validates_inclusion_of :status, in: [true, false]

  has_attached_file :thumbnail, styles: { medium: '385x200#' }
  validates_attachment_content_type :thumbnail, content_type: /\Aimage\/.*\Z/

end

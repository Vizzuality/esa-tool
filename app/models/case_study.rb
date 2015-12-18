class CaseStudy < ActiveRecord::Base

  acts_as_taggable

  has_many :contacts
  has_many :pages
  has_attached_file :cover_image, styles: {
    medium: '385x200#',
    large: '1920x1080#'
  }

  validates :title, presence: true, length: { minimum: 2 }
  validates :template, presence: true, numericality: {
    only_integer: true,
    greater_than_or_equal_to: 1,
    less_than_or_equal_to: 5
  }
  validates_inclusion_of :status, in: [true, false]
  validates_attachment_content_type :cover_image, content_type: /\Aimage\/.*\Z/

  accepts_nested_attributes_for :contacts, reject_if: :all_blank, allow_destroy: true

  def self.find_published(id)
    find_by(id: id, status: true)
  end

  def self.clone(id)
    find(id).deep_clone include: :pages
  end

end

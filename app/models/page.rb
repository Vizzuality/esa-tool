class Page < ActiveRecord::Base

  default_scope { order('created_at ASC') }

  belongs_to :case_study
  has_many :data_layers
  has_many :interest_points
  has_and_belongs_to_many :charts
  has_attached_file :background, styles: {
    medium: '385x200#',
    large: '1920x1080#'
  }

  accepts_nested_attributes_for :data_layers, reject_if: :all_blank, allow_destroy: false
  accepts_nested_attributes_for :interest_points, reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :charts, reject_if: :all_blank, allow_destroy: true

  validates :title, presence: true, length: { minimum: 2 }

  validates_attachment_content_type :background, content_type: /\Aimage\/.*\Z/

end

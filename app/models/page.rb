class Page < ActiveRecord::Base

  belongs_to :case_study
  has_many :data_layers
  has_many :interest_points

  accepts_nested_attributes_for :data_layers, reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :interest_points, reject_if: :all_blank, allow_destroy: true

  validates :title, presence: true, length: { minimum: 2 }

  has_attached_file :background, styles: { large: '1920x1080>' }
  validates_attachment_content_type :background, content_type: /\Aimage\/.*\Z/

end

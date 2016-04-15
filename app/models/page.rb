class Page < ActiveRecord::Base
  has_enumeration_for :page_type, with: PageType, create_helpers: true

  default_scope { order('created_at ASC') }

  belongs_to :case_study
  has_many :data_layers, dependent: :destroy
  has_many :interest_points, dependent: :destroy
  has_and_belongs_to_many :charts, dependent: :destroy
  has_attached_file :background, styles: {
    medium: '385x200#',
    large: '1920x1080#'
  }

  accepts_nested_attributes_for :data_layers, allow_destroy: false
  accepts_nested_attributes_for :interest_points, reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :charts, reject_if: :all_blank, allow_destroy: true

  validates :title, presence: true, length: { minimum: 2 }

  validates_attachment_content_type :background, content_type: /\Aimage\/.*\Z/

  attr_accessor :delete_image

  def delete_image= delete_image
    self.background.clear if delete_image == "true"
  end

end

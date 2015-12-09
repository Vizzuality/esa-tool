class Page < ActiveRecord::Base

  belongs_to :case_study

  validates :title, presence: true, length: { minimum: 2 }

  has_attached_file :background, styles: { large: '1920x1080>' }

end

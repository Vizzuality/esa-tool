class Page < ActiveRecord::Base

  validates :title, presence: true, length: { minimum: 2 }

  has_attached_file :background, styles: { large: '1920x1080>' }

end

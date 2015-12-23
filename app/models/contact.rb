class Contact < ActiveRecord::Base

  belongs_to :case_study

  validates :body, presence: true, length: { minimum: 2 }

  has_attached_file :logo, styles: { medium: '230x100>' }
  validates_attachment_content_type :logo, content_type: /\Aimage\/.*\Z/

end

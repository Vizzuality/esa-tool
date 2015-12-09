class Contact < ActiveRecord::Base

  belongs_to :case_study

  validates :name, presence: true, length: { minimum: 2 }

  has_attached_file :logo, styles: { medium: '230x100>' }

end

class Contact < ActiveRecord::Base

  # before_save
  #   logger.debug "clearingggg:"
  #   logger.debug delete_image
  #   # logo.clear if delete_image == true
  #   logo = nil

  attr_accessor :delete_image
  belongs_to :case_study

  validates :body, presence: true, length: { minimum: 2 }
  validates :website, presence: true

  has_attached_file :logo, styles: { thumb: '100>x40>', medium: '230x100>' }
  validates_attachment_presence :logo
  validates_attachment_content_type :logo, content_type: /\Aimage\/.*\Z/

  def delete_image= delete_image
    self.logo.clear if delete_image == "true"
  end

end

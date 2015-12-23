class AddAttachmentThumbnailToCaseStudies < ActiveRecord::Migration
  def self.up
    change_table :case_studies do |t|
      t.attachment :cover_image
    end
  end

  def self.down
    remove_attachment :case_studies, :cover_image
  end
end

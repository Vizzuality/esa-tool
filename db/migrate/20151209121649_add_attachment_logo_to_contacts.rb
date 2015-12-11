class AddAttachmentLogoToContacts < ActiveRecord::Migration
  def self.up
    change_table :contacts do |t|
      t.attachment :logo
    end
  end

  def self.down
    remove_attachment :contacts, :logo
  end
end

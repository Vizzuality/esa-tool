# Preview all emails at http://localhost:3000/rails/mailers/contact_mailer
class ContactMailerPreview < ActionMailer::Preview

  def contact_form_preview
    contact = ContactForm.first
    ContactMailer.contact_form(contact)
  end

end

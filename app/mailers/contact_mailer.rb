class ContactMailer < ApplicationMailer
  default from: ENV["CONTACT_MAIL_FROM"]

  layout "contact_mailer"

  def contact_form(form)
    @form = form
    mail(to: ENV["CONTACT_MAIL_TO"], subject: 'New submission on esaworld contact form')
  end
end

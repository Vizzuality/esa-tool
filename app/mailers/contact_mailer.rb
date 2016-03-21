class ContactMailer < ApplicationMailer
  default from: "contact@esaworld.com"

  layout "contact_mailer"

  def contact_form(form)
    @form = form
    mail(to: "admin@esaworld.com", subject: 'New submission on esaworld contact form')
  end
end

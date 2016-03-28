class ContactMailer < ApplicationMailer
  default from: "contact@esa.int"

  layout "contact_mailer"

  def contact_form(form)
    @form = form
    mail(to: "joseangel.parreno@vizzuality.com", subject: 'New submission on esaworld contact form')
  end
end

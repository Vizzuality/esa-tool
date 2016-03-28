class ContactFormController < ApplicationController

  respond_to :json

  def create
    if form_params
      @contact = ContactForm.new(form_params)
      if (@contact.save)
        # ContactMailer.contact_form(@contact).deliver_now
        render json: @contact
      else
        render json: @contact
      end
    end
  end

  def form_params
    params.require(:contact_form).permit!
  end

end

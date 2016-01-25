class BackofficeController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  before_action :authenticate_user!

  layout 'backoffice'

  private

  def authorize_admins!
    redirect_to backoffice_case_studies_path unless current_user.is_admin?
  end
end

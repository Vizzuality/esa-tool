class OrganizationsController < BackofficeController

  before_action :set_organization, only: [:edit, :update, :destroy]
  before_action :authorize_admins!

  def index
    @organizations = Organization.order(:name)
  end

  def new
    @organization = Organization.new
  end

  def create
    @organization = Organization.new(organizations_params)
    if @organization.save
      redirect_to backoffice_organizations_path,
        notice: 'Organization created successfully'
    else
      render :new
    end
  end

  def edit
  end

  def update
    if @organization.update(organizations_params)
      redirect_to backoffice_organizations_path,
        notice: 'Organization updated successfully'
    else
      render :edit
    end
  end

  def destroy
    @organization.destroy
    redirect_to backoffice_organizations_path,
      notice: 'Organization deleted successfully'
  end

  private

  def set_organization
    @organization = Organization.find(params[:id])
  end

  def organizations_params
    params.require(:organization).permit(:name)
  end
end

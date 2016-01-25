class Backoffice::UsersController < BackofficeController

  before_action :set_user, only: [:edit, :update, :destroy]
  before_action :set_organizations, only: [:edit, :new]
  before_action :set_change_pwd, only: [:edit, :update]
  before_action :restrict_access!, only: [:edit, :update, :destroy]

  def index
    @users = User.where.not(id: current_user).order(:email)
  end

  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    if @user.save
      redirect_to backoffice_users_path,
        notice: 'User created successfully.'
    else
      set_organizations
      render :new
    end
  end

  def edit
  end

  def update
    if @user.update(user_params)
      redirect_to backoffice_users_path,
        notice: 'User updated successfully.'
    else
      set_organizations
      render :edit
    end
  end

  def destroy
    @user.destroy
    redirect_to backoffice_users_path, notice: 'Page deleted successfully.'
  end

  private

    def set_user
      @user = User.find(params[:id])
    end

    def user_params
      params.require(:user).permit!
    end

    def set_organizations
      @organizations = Organization.all
    end

    def set_change_pwd
      @change_pwd = params[:change_pwd].presence || false
    end

    def restrict_access!
      unless current_user.is_admin? || current_user == @user
        redirect_to backoffice_users_path,
          error: "You are not authorized to access this page."
      end
    end

end

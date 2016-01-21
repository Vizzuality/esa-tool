class Backoffice::UsersController < BackofficeController

  before_action :set_user, only: [:edit, :update, :destroy]
  before_action :set_organizations, only: [:edit, :new]

  def index
    @users = User.where.not(id: current_user)
  end

  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    if @user.save
      redirect_to edit_backoffice_user_path(@user),
        notice: 'User created successfully.'
    else
      set_organizations
      render :new
    end
  end

  def edit
  end

  def update
    if @user.update(page_params)
      redirect_to edit_backoffice_user_path(@user),
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

end

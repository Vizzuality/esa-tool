class Backoffice::UsersController < BackofficeController

  before_action :set_user, only: [:edit]

  def index
    @users = User.where.not(id: current_user)
  end

  def edit
  end

  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    if @user.save
      redirect_to edit_backoffice_user_path(@user), notice: 'User created successfully.'
    else
      render :new
    end
  end

  private

    def set_user
      @user = User.find(params[:id])
    end

    def user_params
      params.require(:user).permit!
    end

end

class Backoffice::PagesController < BackofficeController

  before_action :set_case_study, only: [:new, :create, :edit, :update, :destroy]
  before_action :set_page, only: [:edit, :update, :destroy]

  def new
    @page = Page.new
  end

  def create
    @page = Page.new(page_params)
    if @page.save
      redirect_to edit_backoffice_case_study_page_path(
        @case_study, @page, type: @page[:page_type]
      ), notice: 'Page created successfully.'
    else
      render :new
    end
  end

  def edit
  end

  def update
    if @page.update(page_params)
      redirect_to edit_backoffice_case_study_page_path(
        @case_study, @page, type: @page[:page_type]
      ), notice: 'Page updated successfully.'
    else
      render :edit
    end
  end

  def destroy
    @page.destroy
    redirect_to edit_backoffice_case_study_path(@case_study),
      notice: 'Page deleted successfully.'
  end

  private

    def set_case_study
      @case_study = CaseStudy.find(params[:case_study_id])
    end

    def set_page
      @page = Page.find(params[:id])
    end

    def page_params
      params.require(:page).permit(
        :title,
        :body,
        :background,
        :color_palette,
        :custom_color_palette_list,
        :page_type,
        :chart_type_list,
        :case_study_id,
        data_layers_attributes: [:id, :file, :year, :_destroy],
        interest_points_attributes: [:id, :lat, :lng, :distance, :_destroy]
      )
    end

end

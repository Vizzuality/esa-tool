class Backoffice::PagesController < BackofficeController

  before_action :set_case_study, only: [:new, :create, :edit, :update, :destroy]
  before_action :set_page, only: [:edit, :update, :destroy]

  def new
    @page = Page.new
    @charts = Chart.all
  end

  def create
    @page = Page.new(page_params)

    if file_params.has_key?(:file)
      data_layer = DataLayer.new(page_id: @page.id)
        .create_file(file_params[:file])
      @page.data_layer = data_layer
    end

    if @page.save
      redirect_to edit_backoffice_case_study_page_path(
        @case_study, @page, type: @page[:page_type]
      ), notice: 'Page created successfully.'
    else
      render :new
    end
  end

  def edit
    @charts = Chart.all
  end

  def update
    @charts = Chart.all
    if file_params.has_key?(:file)
      if @page.data_layer
        data_layer = @page.data_layer
          .create_file(file_params[:file])
      else
        data_layer = DataLayer.create(page_id: @page.id)
          .create_file(file_params[:file])
      end
      @page.data_layer = data_layer
    end

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
        :body_first,
        :body_second,
        :body_thirth,
        :background,
        :color_palette,
        # :custom_color_palette,
        :page_type,
        :chart_type_list,
        :case_study_id,
        interest_points_attributes: [:id, :name, :lat, :lng, :radius, :_destroy],
        chart_ids: []
      )
    end

    def file_params
      params.require(:page).permit(:file)
    end

end

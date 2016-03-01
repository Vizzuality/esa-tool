class Backoffice::PagesController < BackofficeController

  before_action :set_case_study, only: [:new, :create, :edit, :update, :destroy]
  before_action :set_page, only: [:edit, :update, :destroy]
  before_action :set_charts, only: [:new, :edit]

  def new
    @page = @case_study.pages.new(page_type: params[:type])
    @page.data_layers.build
  end

  def create
    @page = @case_study.pages.new(page_params)
    if @page.save

      upload_pending_files

      redirect_to edit_backoffice_case_study_page_path(
        @case_study, @page,
          type: @page.page_type,
          shapefile: nil
      ), notice: 'Page created successfully.'
    else
      @page.data_layers.build if @page.data_layers.empty?
      set_charts
      render :new
    end
  end

  def edit
    gon.cartodb_user = ENV["CDB_USERNAME"]
    gon.case_study = @case_study.to_json
    gon.page = @page.to_json(include: :data_layers)
  end

  def update
    if @page.update(page_params)

      upload_pending_files

      redirect_to edit_backoffice_case_study_page_path(
        @case_study, @page, type: @page.page_type
      ), notice: 'Page updated successfully.'
    else
      @page.data_layers.build if @page.data_layers.empty?
      gon.cartodb_user = ENV["CDB_USERNAME"]
      gon.case_study = @case_study.to_json
      set_charts
      render :edit
    end
  end

  def destroy
    @page.destroy
    redirect_to edit_backoffice_case_study_path(@case_study),
      notice: 'Page deleted successfully.'
  end

  private

    def upload_pending_files
      @page.data_layers.each do |d|
        Resque.enqueue(CartoDbImporter, d.id) if d.import_status == "pending"
      end
    end

    def set_case_study
      @case_study = CaseStudy.find(params[:case_study_id])
    end

    def set_page
      @page = Page.find(params[:id])
    end

    def set_charts
      @charts = Chart.all
    end

    def page_params
      params.require(:page).permit(
        :title,
        :basemap,
        :basemap_url,
        :body,
        :background,
        :color_palette,
        :custom_basemap,
        :page_type,
        :chart_type_list,
        :case_study_id,
        :column_selected,
        :delete_image,
        data_layers_attributes: [
          :id,
          :table_name,
          :year,
          :shapefile,
          :layer_column,
          :layer_column_alias,
          :raster_type,
          :raster_categories,
          :custom_columns_colors
        ],
        interest_points_attributes: [:id, :name, :lat, :lng, :radius, :_destroy, :description],
        chart_ids: []
      )
    end

end

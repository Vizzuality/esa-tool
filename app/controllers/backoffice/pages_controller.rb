class Backoffice::PagesController < BackofficeController

  before_action :set_case_study, only: [:new, :create, :edit]
  before_action :set_page, only: [:edit]

  def edit
  end

  def update
  end

  def create
    @page = Page.new(page_params)
    if @page.save
      redirect_to edit_backoffice_case_study_page_path(@case_study, @page), notice: 'Page created successfully.'
    else
      render :new
    end
  end

  def new
    @page = Page.new
  end

  def destroy
  end

  private

    def set_case_study
      @case_study = CaseStudy.find(params[:case_study_id])
    end

    def set_page
      @page = Page.find(params[:id])
    end

    def page_params
      params.require(:page).permit(:title, :body, :background, :page_type, :case_study_id)
    end

end

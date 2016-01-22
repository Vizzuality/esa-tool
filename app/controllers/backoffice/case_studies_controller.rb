class Backoffice::CaseStudiesController < BackofficeController

  before_action :set_case_study, only: [:show, :edit, :update, :destroy]
  before_action :restrict_access!, only: [:edit, :update, :destroy]

  def index
    @case_studies = if current_user.is_admin?
                      CaseStudy.all
                    else
                      current_user.organization.case_studies
                    end
  end

  def show
    redirect_to edit_backoffice_case_study_path(@case_study)
  end

  def new
    @case_study = CaseStudy.new
    @contacts = @case_study.contacts.build
  end

  def edit
    @contacts = @case_study.contacts.build
  end

  def create
    @case_study = CaseStudy.new(case_studies_params)
    if @case_study.save
      redirect_to edit_backoffice_case_study_path(@case_study),
        notice: 'Case study created successfully.'
    else
      render :new
    end
  end

  def update
    if @case_study.update(case_studies_params)
      redirect_to backoffice_case_studies_path,
        notice: 'Case study updated successfully.'
    else
      render :edit
    end
  end

  def destroy
    @case_study.destroy
    redirect_to backoffice_case_studies_path,
      notice: 'Case study deleted successfully.'
  end

  def duplicate
    @case_study = CaseStudy.clone(params[:id])
    if @case_study.save
      redirect_to edit_backoffice_case_study_path(@case_study),
        notice: 'Case study duplicated successfully.'
    else
      redirect_to edit_backoffice_case_study_path(@case_study),
        alert: 'Case study duplication failed.'
    end
  end

  private

    def set_case_study
      @case_study = CaseStudy.find(params[:id])
    end

    def case_studies_params
      params.require(:case_study).permit(
        :title,
        :description,
        :published,
        :lat,
        :lng,
        :template,
        :cover_image,
        :tag_list,
        contacts_attributes: [:id, :body, :logo, :website, :_destroy]
      )
    end

    def restrict_access!
      unless current_user.is_admin? || current_user.can_manage?(@case_study)
        redirect_to backoffice_case_studies_path,
          error: "You can only manage your Organization's case studies."
      end
    end

end

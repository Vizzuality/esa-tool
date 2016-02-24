class Backoffice::CaseStudiesController < BackofficeController

  before_action :set_case_study, only: [:show, :edit, :update, :destroy]
  before_action :set_existing_contacts, only: [:new, :edit]
  before_action :restrict_access!, only: [:edit, :update, :destroy]

  def index
    @case_studies = if current_user.is_admin?
                      CaseStudy.all
                    else
                      current_user.organization.try(:case_studies) || []
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
    @contacts = @case_study.contacts.presence || @case_study.contacts.build
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
      redirect_to [:backoffice, @case_study],
        notice: 'Case study updated successfully.'
    else
      set_existing_contacts
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
      redirect_to request.referrer || backoffice_dashboard_path,
        alert: 'Case study duplication failed.'
    end
  end

  private

    def set_case_study
      @case_study = CaseStudy.find(params[:id])
    end

    def set_existing_contacts
      @existing_contacts = Contact.all.where.not(logo_file_name: nil).to_a
      @existing_contacts.uniq!{|c| c.logo_file_name}
    end

    def case_studies_params
      params.require(:case_study).permit(
        :title,
        :slug,
        :description,
        :published,
        :lat,
        :lng,
        :template,
        :cover_image,
        :tag_list,
        :delete_image,
        contacts_attributes: [:id, :body, :logo, :website, :_destroy,
          :delete_image, :logo_from_contact_id]
      )
    end

    def restrict_access!
      unless current_user.is_admin? || current_user.can_manage?(@case_study)
        redirect_to backoffice_case_studies_path,
          error: "You can only manage your Organization's case studies."
      end
    end

end

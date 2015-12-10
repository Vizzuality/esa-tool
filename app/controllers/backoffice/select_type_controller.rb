class Backoffice::SelectTypeController < BackofficeController

  def index
    @case_study = CaseStudy.find(params[:case_study_id])
  end

end

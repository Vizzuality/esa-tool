class LandingController < ApplicationController

  layout "landing"

  def index
    @tags = Tag.all
    @case_studies = CaseStudy.get_tag_filtered(case_studies_params).limit(9)
    respond_to do |format|
      format.html
      format.json{ render json: @case_studies }
    end
  end

  private
  def case_studies_params
    params.permit(tags:[])
  end

end

class CaseStudiesController < ApplicationController

  def show
    @case_study = CaseStudy.find_published(params[:id])
    unless @case_study
      not_found
    end
  end

end

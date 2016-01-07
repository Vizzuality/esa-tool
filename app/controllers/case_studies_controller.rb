class CaseStudiesController < ApplicationController

  def show
    @case_study = CaseStudy.find_published(params[:id])
    gon.case_study = @case_study.to_json(include: [:contacts, :pages])
    unless @case_study
      not_found
    end
  end

end

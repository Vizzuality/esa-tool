class CaseStudiesController < ApplicationController

  def show
    @case_study = CaseStudy.where(id: params[:id]).includes(:pages).first
  end

end

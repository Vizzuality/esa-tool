
class CaseStudiesController < ApplicationController

  after_action :check_case_study

  def index
    if case_studies_params[:search]
      @case_study = CaseStudy.search(case_studies_params[:search])
      render json: @case_study
    elsif case_studies_params[:tags]
      @case_study = CaseStudy.get_tag_filtered(case_studies_params).limit(9)
      render json: @case_study
    else
      @case_study = CaseStudy.limit(9)
      render json: @case_study
    end
  end

  def show
    @case_study = CaseStudy.find_published(params[:id])
    gon.case_study = @case_study.to_json(include: [:contacts, {pages: {include: [:data_layers, :charts]}}])
    gon.cartodb_user = ENV["CDB_USERNAME"]
  end

  def preview
    if user_signed_in?
      @case_study = CaseStudy.find(params[:id])
    else
      not_found
    end
  end

  private

    def check_case_study
      unless @case_study
        not_found
      end
    end

    def case_studies_params
      params.permit(:search, tags:[])
    end

end

class CaseStudiesController < ApplicationController

  after_action :check_case_study

  def show
    @case_study = CaseStudy.find_published(params[:id])
    gon.case_study = @case_study.to_json(include: [:contacts, {pages: {include: [:data_layer]}}])
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

end
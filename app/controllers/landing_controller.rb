class LandingController < ApplicationController

  layout "landing"

  def index
    @tags = Tag.all
    @case_studies = CaseStudy.limit(9)

    gon.cartodb_user = ENV["CDB_USERNAME"]
  end

end

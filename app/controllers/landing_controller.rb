class LandingController < ApplicationController

  layout "landing"

  def index
    @contact_form = ContactForm.new
    @tags = Tag.all
    @case_studies = CaseStudy.published.limit(9)

    gon.case_studies = ActiveModel::ArraySerializer.
      new(@case_studies, each_serializer: CaseStudySerializer).to_json
    gon.cartodb_user = ENV["CDB_USERNAME"]
  end
end

class LandingController < ApplicationController

  layout "landing"

  def index
    @tags = Tag.all
    @case_studies = CaseStudy.limit(9)

    # gon.case_studies = render_to_string json: @case_studies, each_serializer: CaseStudySerializer
    gon.case_studies = serialize_cases(@case_studies)
    gon.cartodb_user = ENV["CDB_USERNAME"]


  end

  private

  def serialize_cases(cases)
    Struct.new("CaseSerializedClass", :id, :title, :case_path, :lat, :lng)
    cases_serialized = []
    cases.each do |c|
      case_serialized = Struct::CaseSerializedClass.new(
        c.id,
        c.title,
        case_study_path(c.slug),
        c.lat,
        c.lng
      )
      cases_serialized << case_serialized
    end
    return cases_serialized.to_json
  end

end

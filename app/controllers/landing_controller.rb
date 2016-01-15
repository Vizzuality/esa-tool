class LandingController < ApplicationController

  layout "landing"

  def index
    @tags = Tag.all
    @case_studies = CaseStudy.get_tag_filtered(case_studies_params).limit(9)

    gon.case_studies = @case_studies.to_json
    gon.cartodb_user = ENV["CDB_USERNAME"]

    respond_to do |format|
      format.html
      format.json{ render json: @case_studies }
    end

  end

  private
  def case_studies_params
    params.permit(tags:[])
  end

  def serialized_case

    ActiveModel::SerializableResource.new(case_studies).serializer
    #
    # message_json = ActiveModel::SerializableResource.new(@case_studies).as_json
    # MessageCreationWorker.perform(message_json)
    # head 204

    # options = {}
    # serialization = SerializableResource.new(@case_studies, options)
    # serialization.to_json
end

end

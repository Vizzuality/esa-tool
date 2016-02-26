class Backoffice::DataLayersController < ApplicationController

  before_action :authenticate_user!

  respond_to :json

  def index
    if data_layer_params[:id]
      layer = DataLayer.where(id:data_layer_params[:id]).first
      body = layer.nil? ? { error:'404', msg: 'Data layer not found', data_layer:{}} : layer
    else
      body = { error:'400', msg: 'You need to provide a id', data_layer:{}}
    end
    render json: body
  end

  def data_layer_params
    params.permit(:id)
  end

end

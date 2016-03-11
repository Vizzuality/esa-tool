class Backoffice::DataLayersController < BackofficeController

  before_action :set_data_layer, only: [:show, :destroy]

  respond_to :json

  def show
    body = @data_layer ||
      { error:'400', msg: 'You need to provide an id', data_layer:{}}
    render json: body
  end

  def destroy
    @data_layer.destroy
    render json: true
  end


  private

  def set_data_layer
    @data_layer = DataLayer.find(params[:id])
  end
end

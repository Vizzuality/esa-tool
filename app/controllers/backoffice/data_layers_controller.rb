class Backoffice::DataLayersController < BackofficeController

  before_action :set_data_layer, only: [:show, :destroy]

  respond_to :json

  def show
    body = @data_layer ||
      { error:'400', msg: 'You need to provide an id', data_layer:{}}
    render json: body
  end

  def destroy
    @page = @data_layer.page
    @data_layer.destroy
    respond_to do |format|
      format.json { render json: true }
      format.html { redirect_to edit_backoffice_case_study_page_path(@page.case_study, @page) }
    end
  end


  private

  def set_data_layer
    @data_layer = DataLayer.find(params[:id])
  end
end

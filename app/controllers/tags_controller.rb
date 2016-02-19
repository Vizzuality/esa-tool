class TagsController < ApplicationController

  respond_to :json

  def index
    if tags_params[:term]
      respond_with Tag.where("name like ?", "%#{tags_params[:term].downcase}%"), root: false
    else
      respond_with Tag.all, root: false
    end
  end

  def tags_params
    params.permit(:term)
  end

end

class PageSerializer < ActiveModel::Serializer
  
  def attributes
    object.attributes.symbolize_keys
  end

  has_many :data_layers

end

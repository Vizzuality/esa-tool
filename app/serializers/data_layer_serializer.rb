class DataLayerSerializer < ActiveModel::Serializer
  def attributes
    object.attributes.symbolize_keys
  end
end

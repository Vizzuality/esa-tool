require 'test_helper'

class DataLayerTest < ActiveSupport::TestCase

  test "should not save data layer without data" do
    data_layer = DataLayer.new
    assert_not data_layer.save
  end

end

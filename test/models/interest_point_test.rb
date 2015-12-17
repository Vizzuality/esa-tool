require 'test_helper'

class InterestPointTest < ActiveSupport::TestCase

  test "should not save interest point without data" do
    interest_point = InterestPoint.new
    assert_not interest_point.save
  end

end

require 'test_helper'

class PageTest < ActiveSupport::TestCase

  test "should not save page without data" do
    page = Page.new
    assert_not page.save
  end

end

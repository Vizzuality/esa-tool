require 'test_helper'

class ContactTest < ActiveSupport::TestCase

  test "should not save contact without data" do
    contact = Contact.new
    assert_not contact.save
  end

end

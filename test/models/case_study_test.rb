require 'test_helper'

class CaseStudyTest < ActiveSupport::TestCase

  test "should not save case study without data" do
    case_study = CaseStudy.new
    assert_not case_study.save
  end

end

require 'rails_helper'

RSpec.describe User, type: :model do

  it "has a valid factory" do
    user = FactoryGirl.create(:user)
    expect(user).to be_valid
  end

  context ".can_manage?" do
    before(:each) do
      @org = FactoryGirl.create(:organization)
    end

    it "can manage case_studies from its organization" do
      user = FactoryGirl.create(:user, organization: @org)
      case_study = FactoryGirl.create(:case_study, organization: @org)
      expect(user.can_manage?(case_study)).to be(true)
    end

    it "cannot manage case_studies from other organizations" do
      user = FactoryGirl.create(:user, organization: @org)
      case_study = FactoryGirl.create(:case_study)
      expect(user.can_manage?(case_study)).to be(false)
    end

    it "cannot manage case_studies if doesn't have an organization" do
      user = FactoryGirl.create(:user, organization: nil)
      case_study = FactoryGirl.create(:case_study, organization: @org)
      expect(user.can_manage?(case_study)).to be(false)
    end

    it "can manage any case_study if is_admin" do
      user = FactoryGirl.create(:user, is_admin: true)
      case_study = FactoryGirl.create(:case_study, organization: @org)
      case_study2 = FactoryGirl.create(:case_study)
      expect(user.can_manage?(case_study)).to be(true)
      expect(user.can_manage?(case_study2)).to be(true)
    end
  end

end

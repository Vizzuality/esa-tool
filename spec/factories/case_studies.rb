require 'faker'

FactoryGirl.define do
  factory :case_study do |f|
    f.title { Faker::Lorem.sentence }
    f.lat { 23 }
    f.lng { 23 }
    f.template { 1 }
    f.association :organization, factory: :organization
  end
end

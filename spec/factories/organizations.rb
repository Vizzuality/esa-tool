require 'faker'

FactoryGirl.define do
  factory :organization do |f|
    f.name { Faker::Name.name }
  end
end

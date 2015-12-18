require 'faker'

FactoryGirl.define do
  factory :user do |f|
    f.email { Faker::Internet.email }
    f.password { Faker::Internet.password }
    f.password_confirmation { |u| u.password }
  end
end

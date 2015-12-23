# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

if Rails.env == 'development'

  users = [
    { email: 'admin@example.com', password: 'password', password_confirmation: 'password' },
    { email: 'user1@example.com', password: 'password', password_confirmation: 'password' },
    { email: 'user2@example.com', password: 'password', password_confirmation: 'password' }
  ]

  case_studies = [
    { title: 'Multi-hazard Vulnerability Assessment in Ho Chi Minh City and Yogyakarta', published: true }
  ]

  User.create(users)
  puts "Users created successfully"

  CaseStudy.create(case_studies)
  puts "Case studies created successfully"
  
end

Chart.create([{name: 'pie'}, {name: 'bar'}, {name: 'line'}])
puts "Created charts"

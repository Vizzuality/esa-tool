# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

if Rails.env == 'development'

  vizz = Organization.create(name: 'Vizzuality')
  monsters = Organization.create(name: 'Monsters Inc.')

  users = [
    { email: 'admin@example.com', password: 'password', password_confirmation: 'password',
      is_admin: true, organization_id: vizz.id },
    { email: 'user1@example.com', password: 'password',
      password_confirmation: 'password', organization_id: monsters.id },
    { email: 'user2@example.com', password: 'password',
      password_confirmation: 'password', organization_id: monsters.id },
  ]

  case_studies = [
    { title: 'Multi-hazard Vulnerability Assessment in Ho Chi Minh City and Yogyakarta',
      published: true, organization_id: monsters.id,
      lat: 38.7755940, lng: -9.1353670, template: 1 }
  ]

  User.create(users)
  puts "Users created successfully"

  CaseStudy.create(case_studies)
  puts "Case studies created successfully"

end

Chart.create([{name: 'pie'}, {name: 'bar'}, {name: 'line'}])
puts "Created charts"

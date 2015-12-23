# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

if Rails.env == 'development'
  # Default admin user
  default_user = User.new(email: 'admin@example.com', password: 'password', password_confirmation: 'password')
  if default_user.save
    puts "User #{default_user.email} created successfully"
  end
end

Chart.create([{name: 'pie'}, {name: 'bar'}, {name: 'line'}])
puts "Created charts"

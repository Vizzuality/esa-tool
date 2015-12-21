source 'https://rubygems.org'

ruby '2.2.2'

gem 'rails', '4.2.5'
gem 'sqlite3'

# Assets managment
gem 'sass-rails', '~> 5.0'
gem 'uglifier', '>= 1.3.0'
gem 'coffee-rails', '~> 4.1.0'
gem 'jquery-rails'
gem 'autoprefixer-rails'

# Templating
gem 'slim-rails'
gem 'simple_form'
gem 'cocoon'

# Rails Assets is the frictionless proxy between Bundler and Bower
source 'https://rails-assets.org' do
  gem 'rails-assets-normalize-css'
  gem 'rails-assets-d3'
  gem 'rails-assets-leaflet'
  gem 'rails-assets-underscore'
  gem 'rails-assets-backbone'
  gem 'rails-assets-tagsinput'
  gem 'rails-assets-slick.js'
end

# Active record
gem 'paperclip', '~> 4.3'
gem 'acts-as-taggable-on', '~> 3.4'
gem 'devise'
gem 'deep_cloneable', '~> 2.1.1'
gem 'bcrypt', '~> 3.1.7'

# API
# gem 'sdoc', '~> 0.4.0', group: :doc

group :development, :test do
  gem 'dotenv-rails'
  gem 'byebug'
end

group :development do
  gem 'web-console', '~> 2.0'
  gem 'spring'
  gem 'tzinfo-data' # Required in Windows OS
end

group :test do
  gem 'rspec-rails', '~> 3.0'
  gem 'factory_girl_rails'
  gem 'faker'
end

postgres -D /usr/local/var/postgres &
redis-server /usr/local/etc/redis.conf &
RAILS_ENV=development bundle exec resque-pool &
rails s

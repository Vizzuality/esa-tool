require "resque/tasks"

task "resque:setup" => :environment

# this task will get called before resque:pool:setup
# and preload the rails environment in the pool manager
task "resque:pool:setup" do
  # close any sockets or files in pool manager
  ActiveRecord::Base.connection.disconnect!
  Resque::Pool.after_prefork do
    ActiveRecord::Base.establish_connection
  end
end

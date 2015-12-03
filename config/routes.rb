Rails.application.routes.draw do

  namespace :backoffice do
    get 'dashboard' => 'dashboard#index'
  end

  get 'case-studies/:id' => 'case_studies#show'

  root 'welcome#index'
end

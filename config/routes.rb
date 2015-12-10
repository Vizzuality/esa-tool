Rails.application.routes.draw do

  devise_for :users

  namespace :backoffice do
    resources :case_studies, path: 'case-studies' do
      resources :pages
      get 'select_type' => 'select_type#index'
    end

    root 'case_studies#index', as: 'dashboard'
  end

  get 'case-studies/:id' => 'case_studies#show'

  root 'welcome#index', as: 'root'

end

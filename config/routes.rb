Rails.application.routes.draw do

  devise_for :users

  namespace :backoffice do
    resources :case_studies, path: 'case-studies' do
      resources :pages, except: [:index, :show]
      resources :select_type, only: [:index]
    end

    resources :users, except: [:show]

    root 'case_studies#index', as: 'dashboard'
  end

  resources :case_studies, only: [:show], path: 'case-studies'

  root 'welcome#index', as: 'root'

end

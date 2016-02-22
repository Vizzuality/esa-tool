Rails.application.routes.draw do

  devise_for :users

  namespace :backoffice do
    resources :case_studies, path: 'case-studies' do
      resources :pages, except: [:index, :show]
      resources :select_type, only: [:index]
      post 'duplicate', on: :member
    end

    resources :users, except: [:show]
    resources :organizations, except: [:show]

    root 'case_studies#index', as: 'dashboard'
  end

  resources :case_studies, only: [:index, :show], param: :slug, path: 'case-studies' do
    get 'preview', on: :member
  end

  resources :tags, defaults: { format: 'json' }
  get '/tags', to: 'tags#index'


  root 'landing#index', as: 'root'

end

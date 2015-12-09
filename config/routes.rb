Rails.application.routes.draw do

  devise_for :users
  namespace :backoffice do
    resources :case_studies, path: 'case-studies', only: [:index, :edit, :create, :new, :update, :destroy]

    root 'case_studies#index', as: 'dashboard'
  end

  get 'case-studies/:id' => 'case_studies#show'

  root 'welcome#index', as: 'root'

end

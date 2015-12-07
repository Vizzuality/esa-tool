Rails.application.routes.draw do

  namespace :backoffice do
    resources :case_studies, path: 'case-studies', only: [:index, :edit, :create, :new, :update]

    root 'case_studies#index', as: 'dashboard'
  end

  get 'case-studies/:id' => 'case_studies#show'

  root 'welcome#index', as: 'root'

end

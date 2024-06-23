Rails.application.routes.draw do
  devise_for :users
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  devise_scope :user do
    get '/users/sign_out' => 'devise/sessions#destroy'
    get '/sign_out'       => 'devise/sessions#destroy'
    get '/sign_in'        => 'devise/sessions#new'
    get '/login'          => 'devise/sessions#new'
    get '/sign_up'        => 'users/registrations#new'
  end

  namespace :admin do
    resources :organizations, shallow: true do
      resources :menus, shallow: true

      resources :categories, shallow: true do
        resources :items, shallow: true
      end

      resources :items do
        resources :datasheets, shallow: true do
          resources :datasheet_lines, shallow: true do
            collection do
              post :new_line
            end
          end

          member do
            get :calculate_cmv
          end
        end
      end

      resources :user_organizations, shallow: true
    end
  end

  get '/index' => 'public#index'
  get '/admin' => 'admin/organizations#index'
  get '/admin/dashboard' => 'admin#dashboard'

  root to: 'public#index'
end

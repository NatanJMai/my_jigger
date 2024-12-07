require 'sidekiq/web'

Rails.application.routes.draw do
  # Sidekiq web UI route, add authentication if needed
  mount Sidekiq::Web => '/sidekiq'

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
    resources :organizations, param: :id do
      resources :menus do
        member do
          get :cost_analysis
          get :best_items
          get :matrix_popularity
          get :sales_performance
        end

        resources :items
      end

      resources :categories, only: %i[index show]
      resources :import_jobs, except: %i[edit delete]

      resources :items do
        resource :datasheet, shallow: false, except: :index do
          resources :datasheet_lines do
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

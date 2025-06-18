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

  # Admin namespace
  namespace :admin do
    resources :organizations do
      resources :menus, shallow: true do
        member do
          get :cost_analysis
          get :best_items
          get :matrix_popularity
          get :sales_performance
        end

        resources :charts, only: [] do
          collection do
            get 'sales_performance_by_menu_pie'
            get 'sales_performance_by_categories_pie'
            get 'sales_performance_by_menu'
            get 'revenue_by_category'
            get 'price_vs_costs_by_menu'
            get 'costs_vs_profit_by_menu'
          end
        end

        resources :items, only: %i[index show]

        namespace :ai do
          post 'assistant/analyze', to: 'assistant#analyze_menu'
          post 'assistant/feedback', to: 'assistant#feedback'
          get 'assistant/recommendations', to: 'assistant#recommendations'
        end
      end

      resources :categories, shallow: true do
        resources :charts, only: [] do
          collection do
            get 'sales_performance_by_category'
            get 'revenue_performance_by_category'
          end
        end
      end

      resources :import_jobs, except: %i[edit delete]

      resources :items, shallow: true do
        resources :charts, only: [] do
          collection do
            get 'sales_performance_by_item'
            get 'item_production_costs'
          end
        end

        resource :datasheet, except: :index do
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
      resources :orders, shallow: true, only: %i[show index]

      resources :ingredients, shallow: true do
        collection do
          get 'find'
          get 'calculate'
        end

        member do
          get 'details'
        end
      end

      namespace :ai do
        resources :ai_prompt_logs, only: %w[index show] do
          collection do
            get 'by_topic'
          end
        end
      end
    end
  end

  get '/index' => 'public#index'
  get '/admin' => 'admin/organizations#index'
  get '/admin/dashboard' => 'admin#dashboard'

  root to: 'public#index'
end

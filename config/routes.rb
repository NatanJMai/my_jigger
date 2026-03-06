require 'sidekiq/web'

Rails.application.routes.draw do
  # Locale route
  scope '(:locale)', locale: /en|pt-BR/ do
    # Devise routes
    devise_for :users, controllers: {
      registrations: 'users/registrations',
      passwords: 'users/passwords',
      sessions: 'users/sessions'
    }

    # Sidekiq web UI route, add authentication if needed
    mount Sidekiq::Web => '/sidekiq'

    # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

    devise_scope :user do
      get '/login'          => 'users/sessions#new'
      get '/sign_in'        => 'users/sessions#new'
      get '/sign_up'        => 'users/registrations#new'
      get '/users/sign_out' => 'devise/sessions#destroy'
      get '/sign_out'       => 'devise/sessions#destroy'
    end

    # Admin namespace
    namespace :admin do
      resources :organizations do
        member do
          post :select
        end

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
              get 'seller_overview_performance'
              get 'revenue_by_category'
              get 'price_vs_costs_by_menu'
              get 'costs_vs_profit_by_menu'
              post 'ai_forecast'
            end
          end

          resources :items, only: %i[index show]

          namespace :ai do
            get  'assistant/analyze', to: 'assistant#analyze_menu'
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

        resources :import_jobs, except: %i[edit destroy] do
          collection do
            get 'download_template'
          end
        end

        resources :items, shallow: true do
          resources :charts, only: [] do
            collection do
              get 'sales_performance_by_item'
              get 'item_production_costs'
            end
          end

          resource :datasheet do
            resources :datasheet_lines do
              collection do
                get :new_line
              end
            end
            member do
              get :calculate_cmv
            end
          end
        end

        resources :user_organizations, shallow: true
        resources :orders, shallow: true

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
              post 'by_topic'
            end
            member do
              post 'feedback'
            end
          end
        end
      end

      get 'dashboard/index-2', to: 'dashboard#index_2'
      get 'dashboard/index'
    end

    get '/index' => 'public#index'
    get '/admin' => 'admin/dashboard#index'
    get '/admin/dashboard' => 'admin#dashboard'

    root to: 'public#index'
  end
end

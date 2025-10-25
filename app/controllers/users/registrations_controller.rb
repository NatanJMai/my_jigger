# app/controllers/users/registrations_controller.rb
class Users::RegistrationsController < Devise::RegistrationsController
  # You can override methods here (like 'new', 'create', 'edit', 'update', 'destroy')
  # to add custom logic before or after Devise's actions.

  # Example: to use different strong parameters than the default:
  # before_action :configure_sign_up_params, only: [:create]

  # For now, keep it empty to just enable the custom view lookup:
end
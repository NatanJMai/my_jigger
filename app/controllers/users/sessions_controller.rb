# app/controllers/users/sessions_controller.rb
class Users::SessionsController < Devise::SessionsController
  # This file only needs to exist and inherit from the Devise base.
  # It tells Devise to start looking for views in app/views/users/sessions/
end
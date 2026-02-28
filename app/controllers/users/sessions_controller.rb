# app/controllers/users/sessions_controller.rb
class Users::SessionsController < Devise::SessionsController
  layout 'authentication'
end

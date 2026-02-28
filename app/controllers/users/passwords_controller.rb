# app/controllers/users/passwords_controller.rb
class Users::PasswordsController < Devise::PasswordsController
  layout 'authentication'
end

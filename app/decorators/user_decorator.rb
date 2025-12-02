class UserDecorator < ApplicationDecorator
  delegate_all

  def roles_names
    object.roles.map(&:name)
  end
end

class AdminController < ApplicationController
  include AdminHelper

  before_action :authenticate_user!
  before_action :is_admin?

  def dashboard
  end
end

class AdminController < ApplicationController
  include AdminHelper
  include Draper::Decoratable


  before_action :authenticate_user!
  before_action :is_admin?

  def dashboard
  end
end

class AdminController < ApplicationController
  include AdminHelper
  include Draper::Decoratable

  before_action :authenticate_user!
  before_action :is_admin?

  skip_before_action :set_organization, only: [:dashboard]

  def dashboard
  end
end

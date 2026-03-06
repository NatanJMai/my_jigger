class AdminController < ApplicationController
  include AdminHelper
  include Draper::Decoratable

  before_action :authenticate_user!
  before_action :is_admin?

  skip_before_action :set_organization, only: [:dashboard]

  def dashboard
    redirect_to admin_organizations_path(locale: I18n.locale)
  end
end

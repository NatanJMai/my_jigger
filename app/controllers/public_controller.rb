class PublicController < ApplicationController
  def index
    if user_signed_in?
      redirect_to admin_dashboard_path(locale: I18n.locale)
    else
      redirect_to new_user_session_path(locale: I18n.locale)
    end
  end
end

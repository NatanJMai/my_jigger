class ApplicationController < ActionController::Base
  include ApplicationHelper

  before_action :set_organization
  helper_method :current_organization

  private
  def current_organization
    @organization
  end

  def set_organization
    if params[:organization_id].present?
      @organization = Organization.find_by(id: params[:organization_id])

      if @organization
        session[:organization_id] = @organization.id
      else
        session.delete(:organization_id)
        redirect_to root_path, alert: 'Organization not found.'
      end
    elsif session[:organization_id]
      # Load from session if present
      @organization = Organization.find_by(id: session[:organization_id])
      unless @organization
        session.delete(:organization_id)
        redirect_to root_path, alert: 'Organization not found.'
      end
    end
  end

end

class ApplicationController < ActionController::Base
  include ApplicationHelper

  before_action :set_organization
  helper_method :current_organization

  private
  def current_organization
    @organization
  end

  def set_organization
    @organization = find_organization_from_context || find_organization_from_session

    if @organization
      session[:organization_id] = @organization.id
    else
      session.delete(:organization_id)
      redirect_to root_path, alert: 'Organization not found.'
    end
  end

  def find_organization_from_context
    # Dynamically get the model class from the controller name
    model_class = controller_name.classify.safe_constantize

    # Ensure the model class exists and params[:id] is present
    return nil unless model_class && params[:id]

    # If it's the organizations controller, return the organization itself
    if controller_name == 'organizations'
      model_class.find_by(id: params[:id])
    else
      # Check if the model has an `organization` association
      resource = model_class.find_by(id: params[:id])
      resource&.respond_to?(:organization) ? resource.organization : nil
    end
  rescue ActiveRecord::RecordNotFound
    nil
  end


  def find_organization_from_session
    # Fallback to session-stored organization
    Organization.find_by(id: session[:organization_id])
  end
end

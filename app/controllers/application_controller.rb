class ApplicationController < ActionController::Base
  include Pagy::Backend
  include ApplicationHelper

  ORGANIZATIONS_CONTROLLER = 'organizations'

  before_action :set_organization
  before_action :set_locale
  helper_method :current_organization

  private

  def current_organization
    @organization
  end

  def set_locale
    I18n.locale = extract_locale || I18n.default_locale
  end

  def extract_locale
    locale_param = params[:locale]
    return locale_param if locale_param.present? && I18n.available_locales.include?(locale_param.to_sym)

    session[:locale]
  end

  def default_url_options
    { locale: I18n.locale }
  end

  def set_organization
    @organization = find_organization_from_context || find_organization_from_session
    update_organization_session
  end

  def find_organization_from_context
    model_class = controller_name.classify.safe_constantize
    return nil unless model_class && params[:id]

    if organizations_controller?
      model_class.find_by(id: params[:id])
    else
      find_organization_from_resource(model_class)
    end
  end

  def find_organization_from_resource(model_class)
    resource = model_class.find_by(id: params[:id])
    return nil unless resource

    resource.organization if resource.respond_to?(:organization)
  end

  def find_organization_from_session
    return nil unless session[:organization_id]

    Organization.find_by(id: session[:organization_id])
  end

  def update_organization_session
    if @organization
      session[:organization_id] = @organization.id
    else
      session.delete(:organization_id)
    end
  end

  def organizations_controller?
    controller_name == ORGANIZATIONS_CONTROLLER
  end
end

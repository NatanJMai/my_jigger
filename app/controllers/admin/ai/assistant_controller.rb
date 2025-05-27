class Admin::Ai::AssistantController < ApplicationController
  def analyze_menu
    return unless current_organization

    menu = current_organization.menus.find_by(id: params[:menu_id])
    topics = AiRecommendationTopic.all

    return unless menu.present?

    Ai::MenuAnalysisService.new(current_organization, menu).analyse(topics)

  end
end
class Admin::Ai::AssistantController < ApplicationController
  def analyze_menu
    menu = Menu.find_by(id: params[:menu_id])
    organization = menu.organization
    topics = AiRecommendationTopic.all

    return unless organization.present? && menu.present?

    result = Ai::MenuAnalysisService.new(organization, menu).analyse(topics)

  end
end
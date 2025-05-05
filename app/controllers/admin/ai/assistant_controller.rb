class Admin::Ai::AssistantController < ApplicationController
  def analyze_menu
    organization = Organization.find(params[:organization_id])
    menu_items = params[:menu_items]

    result = Ai::MenuAnalysisService.call(
      organization: organization,
      menu_items: menu_items
    )

    if result.success?
      render json: { recommendations: result.recommendations }, status: :ok
    else
      render json: { error: result.error }, status: :unprocessable_entity
    end
  end
end
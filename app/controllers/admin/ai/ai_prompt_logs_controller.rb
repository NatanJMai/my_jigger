class Admin::Ai::AiPromptLogsController < ApplicationController
  load_and_authorize_resource
  load_and_authorize_resource :organization
  load_and_authorize_resource :ai_recommendation_topic
  load_and_authorize_resource :ai_prompt_log, through: :organization

  decorates_assigned :ai_prompt_log, :ai_prompt_logs
  decorates_assigned :organization

  def index
    @ai_prompt_logs = @organization.ai_prompt_logs.order(date: :desc)
  end

  def show; end

  def by_topic
    @ai_prompt_logs = @ai_prompt_logs.by_prompt_type(params[:ai_recommendation_topic_id]).decorate

    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.replace(
          'ai-recommendations',
          partial: 'admin/ai/ai_recommendations/table',
          locals: { ai_prompt_logs: ai_prompt_logs }
        )
      end
    end

  end
end
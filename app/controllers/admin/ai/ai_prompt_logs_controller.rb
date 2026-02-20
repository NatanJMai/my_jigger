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
    topic_id = params[:ai_recommendation_topic_id]
    @ai_prompt_logs = @organization.ai_prompt_logs.by_prompt_type(topic_id)
    @pagy, @ai_prompt_logs = pagy(@ai_prompt_logs.decorate, items: 10)

    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.replace(
          'ai-recommendations',
          partial: 'admin/ai/ai_recommendations/table',
          locals: { ai_prompt_logs: @ai_prompt_logs, topic_id: topic_id, pagy: @pagy }
        )
      end
    end
  end

  def feedback
    item_index = params[:item_index].to_i
    feedback_value = params[:feedback] == 'like' ? 'liked' : 'disliked'

    @ai_prompt_log.set_item_feedback(item_index, feedback_value)

    if @ai_prompt_log.save
      # Get logs from the same menu and topic (if filtered) to refresh the table
      menu = @ai_prompt_log.menu
      topic_id = params[:ai_recommendation_topic_id]
      
      if topic_id.present?
        @ai_prompt_logs = menu.ai_prompt_logs.by_prompt_type(topic_id).order(date: :desc)
      else
        @ai_prompt_logs = menu.ai_prompt_logs.order(date: :desc)
      end
      @pagy, @ai_prompt_logs = pagy(@ai_prompt_logs.decorate, items: 10)

      respond_to do |format|
        format.turbo_stream do
          render turbo_stream: turbo_stream.replace(
            'ai-recommendations',
            partial: 'admin/ai/ai_recommendations/table',
            locals: { ai_prompt_logs: @ai_prompt_logs, topic_id: topic_id, pagy: @pagy }
          )
        end
        format.json { render json: { status: 'success', feedback: feedback_value } }
      end
    else
      respond_to do |format|
        format.turbo_stream { head :unprocessable_entity }
        format.json { render json: { status: 'error', errors: @ai_prompt_log.errors }, status: :unprocessable_entity }
      end
    end
  end
end
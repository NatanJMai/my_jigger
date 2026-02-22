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
    menu_id = params[:menu_id]
    
    # Get menu - either from params or first menu of organization
    menu = if menu_id.present?
      @organization.menus.find_by(id: menu_id)
    else
      @organization.menus.first
    end
    
    return head :not_found unless menu
    
    # Calculate recommendation counts per topic
    recommendation_topics = AiRecommendationTopic.all.order(:name)
    topic_counts = {}
    recommendation_topics.each do |topic|
      topic_logs = menu.ai_prompt_logs.by_prompt_type(topic.id).decorate
      count = 0
      topic_logs.each do |log|
        items = log.display_by_item
        count += items.is_a?(Array) ? items.size : 0
      end
      topic_counts[topic.id] = count
    end
    
    # Get all logs from the specific menu (not paginated yet)
    all_logs = menu.ai_prompt_logs.by_prompt_type(topic_id).order(date: :desc).decorate
    
    # Expand all items from all logs into a flat list with log reference
    all_recommendations = []
    all_logs.each do |log|
      items = log.display_by_item
      if items.present? && items.is_a?(Array)
        items.each_with_index do |item, index|
          all_recommendations << {
            log: log,
            item: item,
            index: index
          }
        end
      end
    end
    
    # Paginate the flat list of recommendations
    @pagy, @paginated_recommendations = pagy_array(all_recommendations, items: 10)
    
    # Keep all logs for reference
    @ai_prompt_logs = all_logs

    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: [
          turbo_stream.replace(
            'ai-recommendations',
            partial: 'admin/ai/ai_recommendations/table',
            locals: { 
              ai_prompt_logs: @ai_prompt_logs, 
              paginated_recommendations: @paginated_recommendations,
              topic_id: topic_id, 
              pagy: @pagy,
              menu: menu,
              organization: @organization
            }
          ),
          turbo_stream.replace(
            'recommendation-topics',
            partial: 'admin/menus/partials/recommendation_topics',
            locals: {
              recommendation_topics: recommendation_topics,
              topic_counts: topic_counts,
              menu: menu,
              organization: @organization
            }
          )
        ]
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
      
      # Get all logs (not paginated yet)
      if topic_id.present?
        all_logs = menu.ai_prompt_logs.by_prompt_type(topic_id).order(date: :desc).decorate
      else
        all_logs = menu.ai_prompt_logs.order(date: :desc).decorate
      end
      
      # Expand all items from all logs into a flat list with log reference
      all_recommendations = []
      all_logs.each do |log|
        items = log.display_by_item
        if items.present? && items.is_a?(Array)
          items.each_with_index do |item, index|
            all_recommendations << {
              log: log,
              item: item,
              index: index
            }
          end
        end
      end
      
      # Paginate the flat list of recommendations
      @pagy, @paginated_recommendations = pagy_array(all_recommendations, items: 10)
      
      # Keep all logs for reference
      @ai_prompt_logs = all_logs

      respond_to do |format|
        format.turbo_stream do
          render turbo_stream: turbo_stream.replace(
            'ai-recommendations',
            partial: 'admin/ai/ai_recommendations/table',
            locals: { 
              ai_prompt_logs: @ai_prompt_logs, 
              paginated_recommendations: @paginated_recommendations,
              topic_id: topic_id, 
              pagy: @pagy,
              menu: menu,
              organization: menu.organization
            }
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
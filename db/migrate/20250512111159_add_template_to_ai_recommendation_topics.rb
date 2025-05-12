class AddTemplateToAiRecommendationTopics < ActiveRecord::Migration[7.1]
  def change
    add_column :ai_recommendation_topics, :template, :text
  end
end

class AddAiRecommendationTopics < ActiveRecord::Migration[7.1]
  def change
    create_table :ai_recommendation_topics do |t|
      t.string :name, index: true
      t.string :status

      t.timestamps
    end
  end
end

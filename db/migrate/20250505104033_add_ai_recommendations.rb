class AddAiRecommendations < ActiveRecord::Migration[7.1]
  def change
    create_table :ai_recommendations do |t|
      t.references :ai_recommendation_topic, index: true, foreign_key: true
      t.references :organization, index: true, foreign_key: true
      t.datetime :date
      t.text :message
      t.string :feedback

      t.timestamps
    end
  end
end

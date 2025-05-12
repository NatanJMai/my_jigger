class AiRecommendationTopic < ApplicationRecord
  has_many :ai_recommendations, class_name: 'AiRecommendation', dependent: :destroy

  validates :name, presence: true
end

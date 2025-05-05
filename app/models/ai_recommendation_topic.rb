class AiRecommendationTopic < ApplicationRecord
  include ClassyEnum::ActiveRecord

  has_many :ai_recommendations, class_name: 'AiRecommendationTopic', dependent: :destroy

  classy_enum_attr :status, class_name: 'ImportStatus'

  validates :name, presence: true
end

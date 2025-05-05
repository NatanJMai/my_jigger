class AiRecommendation < ApplicationRecord
  include ClassyEnum::ActiveRecord

  belongs_to :organization, class_name: 'Organization'
  belongs_to :ai_recommendation_topic, class_name: 'AiRecommendationTopic'

  classy_enum_attr :feedback, class_name: 'AiFeedback'

  validates :ai_recommendation_topic_id, :organization_id, presence: true
end

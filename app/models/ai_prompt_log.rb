class AiPromptLog < ApplicationRecord
  belongs_to :organization, class_name: 'Organization'
  belongs_to :prompt_type, class_name: 'AiRecommendationTopic', optional: true

  validates :organization_id, :date, presence: true

end

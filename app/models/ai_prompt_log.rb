class AiPromptLog < ApplicationRecord
  belongs_to :organization, class_name: 'Organization'

  validates :organization_id, :date, presence: true

end

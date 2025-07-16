class AiPromptLog < ApplicationRecord
  belongs_to :menu, class_name: 'Menu'
  belongs_to :prompt_type, class_name: 'AiRecommendationTopic', optional: true

  validates :menu_id, :date, presence: true

  ##
  # Filter by Topic
  # @param topic_id Integer
  # @return Scope
  scope :by_prompt_type, lambda { |topic_id|
    where(prompt_type_id: topic_id)
  }

  def parse_result_by_item
    return prompt_text

    # content = prompt_output["choices"]&[0]&["message"]&["content"]&.to_json
    # remove_st = content.gsub(/,\s*(\]|\})/, '\1')
    #
    # result_text = JSON.parse(remove_st)
    # JSON.parse(result_text.gsub(/,\s*(\]|\})/, '\1'))
  end
end

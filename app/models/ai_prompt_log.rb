class AiPromptLog < ApplicationRecord
  belongs_to :menu, class_name: 'Menu'
  belongs_to :prompt_type, class_name: 'AiRecommendationTopic', optional: true

  validates :menu_id, :date, presence: true

  ##
  # Get feedback for a specific item index
  # @param index Integer
  # @return String | nil
  def item_feedback_at(index)
    item_feedback[index.to_s]
  end

  ##
  # Set feedback for a specific item index
  # @param index Integer
  # @param feedback_value String ('liked' or 'disliked')
  def set_item_feedback(index, feedback_value)
    self.item_feedback = item_feedback.merge(index.to_s => feedback_value)
  end

  ##
  # Filter by Topic
  # @param topic_id Integer
  # @return Scope
  scope :by_prompt_type, lambda { |topic_id|
    where(prompt_type_id: topic_id)
  }

  ##
  # Parse AI prompt result output by item
  # @return Hash
  def parse_result_by_item
    return {} unless prompt_output.present?
    return {} unless prompt_output.is_a?(Hash)
    return {} unless prompt_output["choices"].present?
    return {} unless prompt_output["choices"].is_a?(Array)
    return {} unless prompt_output["choices"][0].present?
    return {} unless prompt_output["choices"][0]["message"].present?
    return {} unless prompt_output["choices"][0]["message"]["content"].present?

    content = prompt_output["choices"][0]["message"]["content"]
    return {} unless content.present?

    content_json = content.to_json
    remove_st = content_json.gsub(/,\s*(\]|\})/, '\1')

    result_text = JSON.parse(remove_st)
    JSON.parse(result_text.gsub(/,\s*(\]|\})/, '\1'))
  rescue JSON::ParserError, NoMethodError, TypeError => e
    Rails.logger.error "Error parsing prompt output: #{e.message}"
    {}
  end
end

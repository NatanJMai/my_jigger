class AiPromptLog < ApplicationRecord
  belongs_to :organization, class_name: 'Organization'
  belongs_to :prompt_type, class_name: 'AiRecommendationTopic', optional: true

  validates :organization_id, :date, presence: true


  def parse_result
    content = prompt_output["choices"][0]["message"]["content"]&.to_json
    remove_st = content.gsub(/,\s*(\]|\})/, '\1')

    result_text = JSON.parse(remove_st)
    result = JSON.parse(result_text.gsub(/,\s*(\]|\})/, '\1'))

    result.flat_map { |_, suggestions| suggestions }.join("\n")
  end
end

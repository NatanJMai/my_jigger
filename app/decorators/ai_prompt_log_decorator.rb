class AiPromptLogDecorator < ApplicationDecorator
  delegate_all

  def display_input
    object.prompt_input&.to_s.truncate(20)
  end

  def display_text
    object.prompt_text&.truncate(100)
  end

  ##
  # e.g Margarita: Recommendation 1,\n Recommendation 2
  def display_by_item
    json_result = parse_result_by_item

    str_result = []
    json_result.each_pair do |key, values|
      values.each do |value|
        str_result << "<b>#{key}</b>: #{value}"
      end
    end

    str_result
  end
end
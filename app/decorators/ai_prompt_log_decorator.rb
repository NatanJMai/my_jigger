class AiPromptLogDecorator < ApplicationDecorator
  delegate_all

  def display_input
    object.prompt_input&.to_s.truncate(20)
  end

  def display_text
    object.prompt_text&.truncate(100)
  end
end
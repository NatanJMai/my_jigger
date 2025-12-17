class AddFeedbackToAiPromptLogs < ActiveRecord::Migration[8.0]
  def change
    add_column :ai_prompt_logs, :feedback, :string
  end
end

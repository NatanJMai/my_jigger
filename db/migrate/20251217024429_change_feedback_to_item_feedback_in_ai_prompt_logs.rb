class ChangeFeedbackToItemFeedbackInAiPromptLogs < ActiveRecord::Migration[8.0]
  def change
    remove_column :ai_prompt_logs, :feedback, :string
    add_column :ai_prompt_logs, :item_feedback, :jsonb, default: {}, null: false
  end
end

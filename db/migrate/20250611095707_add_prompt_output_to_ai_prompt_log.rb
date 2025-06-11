class AddPromptOutputToAiPromptLog < ActiveRecord::Migration[7.1]
  def change
    add_column :ai_prompt_logs, :prompt_output, :jsonb, default: {}, null: false
  end
end

class RemoveAiPromptLogOrganization < ActiveRecord::Migration[7.1]
  def change
    remove_column :ai_prompt_logs, :organization_id
    add_reference :ai_prompt_logs, :menu, index: true
  end
end

class AddAiPromptLogs < ActiveRecord::Migration[7.1]
  def change
    create_table :ai_prompt_logs do |t|
      t.references :organization, index: true, foreign_key: true
      t.references :prompt_type, foreign_key: { to_table: :ai_recommendation_topics }
      t.datetime :date
      t.jsonb :prompt_input, default: {}, null: false
      t.text :prompt_text
      t.text :response_text
      t.integer :tokens
      t.boolean :success
      t.text :error_message

      t.timestamps
    end
  end
end

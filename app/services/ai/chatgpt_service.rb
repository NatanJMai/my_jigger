require 'openai'

class Ai::ChatgptService
  def initialize
    @client = OpenAI::Client.new(access_token: Rails.application.credentials.dig(:openai, :api_key))
  end

  def send_request(ai_prompt_logs)
    return if ai_prompt_logs.empty?

    ai_prompt_logs.each do |log|
      response = @client.chat(
        parameters: {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'user', content: log.prompt_text }
          ],
          temperature: 0.7
        }
      )

      log.update!(prompt_output: response)
    end
  end
end
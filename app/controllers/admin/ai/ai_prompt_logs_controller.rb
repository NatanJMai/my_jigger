class Admin::Ai::AiPromptLogsController < ApplicationController
  load_and_authorize_resource
  load_and_authorize_resource :organization
  load_and_authorize_resource :ai_prompt_log, through: :organization

  decorates_assigned :ai_prompt_log, :ai_prompt_logs
  decorates_assigned :organization

  def index
    @ai_prompt_logs = @organization.ai_prompt_logs.order(date: :desc)
  end

  def show; end
end
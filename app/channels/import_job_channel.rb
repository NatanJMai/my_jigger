class ImportJobChannel < ApplicationCable::Channel
  def subscribed
    stream_from "import_job_channel_#{params[:import_job_id]}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end

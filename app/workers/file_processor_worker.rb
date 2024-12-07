require 'csv'
require 'nokogiri'
require 'json'


class FileProcessorWorker
  include Sidekiq::Job

  ##
  # Get the ImportJob file and from Import Type (Order / Menu / Item)
  # @param import_job_id Integer
  # @param import_type String (Order, Menu or Item)
  def perform(import_job_id, import_type = '')
    import_job = ImportJob.find(import_job_id)

    return unless import_job.present? && import_type.present?

    file = import_job.file

    debugger

    begin
      records = FileParserService.new(file.file).parse
      debugger
      # records.each { |record| create_record(record) }
    rescue => e
      Rails.logger.error("Failed to process file: #{e.message}")
    end
  end

  private

  ##
  # Process row for CSV/XML/JSON files
  # 1 Import to Staging Table
  def process_row

  end

  ##
  # Send Broadcast to ImportJobChannel
  # @param import_job_id Integer
  # @param data Hash object
  def send_broadcast(import_job_id, data)
    ActionCable.server.broadcast("import_job_channel_#{import_job_id}", data)
  end

end
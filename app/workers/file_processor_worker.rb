require 'csv'
require 'nokogiri'
require 'json'

##
# Process the file for Import Job (Order / Menu or Item)
# Creates Staging Table of those records and Broadcast to ImportJob Channel
class FileProcessorWorker
  include Sidekiq::Job

  ##
  # Get the ImportJob file and from Import Type (Order / Menu / Item)
  # @param import_job_id Integer
  # @param import_type String (Order, Menu or Item)
  def perform(import_job_id, import_type = '')
    @import_job = ImportJob.find(import_job_id)
    @import_type = import_type

    return unless @import_job.present? && import_type.present?

    file = @import_job.file

    begin
      item_records = FileParserService.new(file.file).parse
      process_item_rows(item_records)

    rescue => e
      Rails.logger.error("Failed to process file: #{e.message}")
    end
  end

  private

  ##
  # Find what is Attribute type
  # @param attribute_name String
  # @return Symbol
  def find_data_type(attribute_name)
    case attribute_name
    when String
      :string
    when Integer
      :integer
    when Float
      :float
    when Boolean
      :boolean
    else
      :unknown
    end
  end

  ##
  # Process row for CSV/XML/JSON files
  # Import to Staging Table
  # @param item_records Object Array [{item, volume, unit_type, price}]
  def process_item_rows(item_records)
    return unless item_records.present?

    log_data = []

    # All lines
    item_records.each do |record|
      log_data << record

      record.each_pair do |key, value|
        data_type = find_data_type(value).to_s
        @import_job.staging_tables.create!(attribute_name: key,
                                           row_data: value,
                                           data_type: data_type,
                                           date: Time.zone.now,
                                           staging_table: @import_type,
                                           staging_status: 'in_progress')

      end
    end

    send_broadcast(log_data)
  end

  ##
  # Send Broadcast to ImportJobChannel
  # @param data Hash object
  def send_broadcast(data)
    ActionCable.server.broadcast("import_job_channel_#{@import_job.id}", data)
    sleep(1)
  end
end
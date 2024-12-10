# app/services/staging_service.rb
class StagingService
  def initialize(import_job)
    return unless import_job.present?

    @import_job = import_job
  end

  ##
  # Handle all records created in Staging Table for ImportJob
  # Copy from Staging to original table if all data is correct.
  def handle

  end
end

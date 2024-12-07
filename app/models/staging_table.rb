class StagingTable < ApplicationRecord
  belongs_to :import_job, class_name: 'ImportJob'
  has_many :import_logs, class_name: 'ImportLog'

  classy_enum_attr :staging_table, class_name: 'StagingTable'
  classy_enum_attr :staging_status, class_name: 'StagingStatus'

  validates :row_data, :import_job_id, :staging_status, presence: true

end

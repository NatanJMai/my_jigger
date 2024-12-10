class StagingTable < ApplicationRecord
  include ClassyEnum::ActiveRecord

  belongs_to :import_job, class_name: 'ImportJob'
  has_many :import_logs, class_name: 'ImportLog'

  classy_enum_attr :staging_table, class_name: 'StagingTableType'
  classy_enum_attr :staging_status, class_name: 'StagingStatus'
  classy_enum_attr :data_type, class_name: 'DataType'

  validates :import_job_id, :staging_status, presence: true

end

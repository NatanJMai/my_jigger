class ImportLog < ApplicationRecord
  include ClassyEnum::ActiveRecord

  belongs_to :import_job, class_name: 'Organization'

  classy_enum_attr :log_type, class_name: 'LogType'
  validates :date, :import_job_id, presence: true
end

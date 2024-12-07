class ImportJob < ApplicationRecord
  include ClassyEnum::ActiveRecord

  belongs_to :organization, class_name: 'Organization'
  belongs_to :user, class_name: 'User'
  has_many :import_logs, class_name: 'ImportLog'
  has_many :staging_tables, class_name: 'StagingTable'

  classy_enum_attr :import_status, class_name: 'ImportStatus'
  mount_uploader :file, FileUploader

  validates :user, :organization_id, :import_status, presence: true

end

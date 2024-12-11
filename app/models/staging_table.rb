class StagingTable < ApplicationRecord
  include ClassyEnum::ActiveRecord

  belongs_to :import_job, class_name: 'ImportJob'
  has_many :import_logs, class_name: 'ImportLog'

  classy_enum_attr :staging_table, class_name: 'StagingTableType'
  classy_enum_attr :staging_status, class_name: 'StagingStatus'
  classy_enum_attr :data_type, class_name: 'DataType'

  validates :import_job_id, :staging_status, presence: true

  ##
  # Return Staging Tables of status
  # @param type String
  # @return Scope
  scope :by_status, lambda { |status|
    where(staging_status: status)
  }

  ##
  # Return Staging Tables of Table
  # @param table String
  # @return Scope
  scope :by_table, lambda { |table|
    where(staging_table: table)
  }

  ##
  # Return data in correct Class
  # @return String | Integer | Float | Boolean
  def return_data
    case data_type&.to_sym
    when :string
      row_data.to_s
    when :integer
      row_data.to_i
    when :float
      row_data.to_f
    when :boolean
      row_data.to_s
    else
      nil
    end
  end
end

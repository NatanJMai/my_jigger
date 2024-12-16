# app/services/staging_service.rb
class StagingService
  def initialize(import_job)
    return unless import_job.present?

    @import_job = import_job
  end

  ##
  # Handle all records created in Staging Table for ImportJob
  # Copy from Staging to original table (item) if all data is correct.
  def handle_item
    return nil unless @import_job.present?

    staging_records = @import_job.staging_tables
                                 .by_table('item')
                                 .by_status('in_progress')

    new_item = Item.create(name: @import_job.reference_name,
                           data_imported: true,
                           menu: @import_job.organization.menus.first,
                           organization: @import_job.organization)

    grouped_records = staging_records.group_by(&:object_number)
    permitted_attributes = Ingredient.permitted_methods

    grouped_records.each_value do |records|
      new_ingredient = new_item.ingredients.new
      new_datasheet_line = new_item.datasheet_lines.new

      records.each do |record|
        attribute = record.attribute_name.to_sym
        correct_data = record.return_data

        next unless new_ingredient.respond_to?(attribute) && permitted_attributes.include?(attribute)

        new_ingredient.send("#{attribute}=", correct_data)
        new_datasheet_line.send("#{attribute}=", correct_data)
      end

      new_ingredient.save!
      new_datasheet_line.save!
    end
  end

  ##
  # Handle all records created in Staging Table for ImportJob
  # Copy from Staging to original table (menu) if all data is correct.
  def handle_menu

  end
end

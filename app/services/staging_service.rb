# app/services/staging_service.rb
class StagingService
  def initialize(import_job)
    return unless import_job.present?

    @import_job = import_job
  end

  def start(object_type)
    return unless object_type

    case object_type
    when :order
      handle_order
    when :menu
      handle_menu
    when :item
      handle_item
    end
  end

  ##
  # Handle all records created in Staging Table for ImportJob
  # Copy from Staging to original table (item) if all data is correct.
  def handle_item
    return nil unless @import_job.present?

    organization = @import_job.organization
    staging_records = @import_job.staging_tables
                                 .by_table('item')
                                 .by_status('in_progress')

    new_item = Item.create(name: @import_job.reference_name,
                           data_imported: true,
                           status: true,
                           menu: @import_job.organization.menus.first,
                           organization: organization)

    grouped_records = staging_records.group_by(&:object_number)
    permitted_attributes = Ingredient.permitted_methods

    grouped_records.each_value do |records|
      ingredient_name = records.select { |a| a.attribute_name == 'name' }.first&.row_data || 'Not Found'

      new_ingredient = organization.ingredients.find_or_create_by(name: ingredient_name)

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

  ##
  # Handle all records created in Staging Table for ImportJob
  # Copy from Staging to original table (order) if all data is correct.
  def handle_order
    return nil unless @import_job.present?

    organization = @import_job.organization
    staging_records = @import_job.staging_tables
                                 .by_table('order')
                                 .by_status('in_progress')

    grouped_records = staging_records.group_by(&:object_number)

    permitted_attributes = OrderItem.permitted_methods

    grouped_records.each_value do |records|
      order_number = records.select { |a| a.attribute_name == 'order_nr' }.first&.row_data || 'Not Found'
      order_date = records.select { |a| a.attribute_name == 'order_date' }.first&.row_data || 'Date Not Found'
      item_name = records.select { |a| a.attribute_name == 'product_name' }.first&.row_data || 'Item Not Found'

      item = organization.find_closest_item_or_create(item_name)

      next unless item.present?

      new_order = organization.orders.find_or_create_by!(order_number: order_number) do |o|
        o.data_imported = true
        o.date = order_date
      end

      new_order_item = new_order.order_items.new(item: item)

      records.each do |record|
        attribute = record.attribute_name.to_sym
        correct_data = record.return_data

        next unless new_order_item.respond_to?(attribute) && permitted_attributes.include?(attribute)

        new_order_item.send("#{attribute}=", correct_data)
      end

      new_order_item.save!
    end
  end
end

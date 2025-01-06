class Admin::ChartsController < ApplicationController
  load_and_authorize_resource :item
  load_and_authorize_resource :category
  decorates_assigned :item

  def sales_performance_by_category
    # Define the month you are working with (example: January 2025)
    start_date = Date.new(2025, 1, 1)
    end_date = start_date.end_of_month

    items = @category.items

    # Query to get sales performance of all items in the category
    category_sales = items
                          .joins(:order_items)
                          .joins(:orders)
                          .where(orders: { date: start_date..end_date })
                          .group('items.id') # Group by item to get performance per item
                          .select('items.name as item_name, SUM(order_items.quantity) as total_sales')

    # Create a hash for sales data with all dates and corresponding sales, if any
    sales_data = items.map do |item|
      sales_for_date = category_sales.find { |record| record.item_name == item.name }
      [item.name, sales_for_date ? sales_for_date.total_sales : 0]
    end

    render json: sales_data
  end

  def sales_performance_by_item
    # Define the month you are working with (example: January 2025)
    start_date = Date.new(2025, 1, 1)
    end_date = start_date.end_of_month

    # Generate all dates within the month
    all_dates = (start_date..end_date).to_a

    # Query to get sales data
    sales = @item.order_items
                 .where(item_id: @item.id)
                 .joins(:order)
                 .where(orders: { date: start_date..end_date })
                 .group('DATE(orders.date)')
                 .select('DATE(orders.date) as sale_date, SUM(order_items.quantity) as total_sales')

    # Create a hash for sales data with all dates and corresponding sales, if any
    sales_data = all_dates.map do |date|
      sales_for_date = sales.find { |record| record.sale_date.to_date == date }
      [date.to_s, sales_for_date ? sales_for_date.total_sales : 0] # If no sales, set to 0
    end

    render json: sales_data
  end
end
class Admin::ChartsController < ApplicationController
  include MoneyRails::ActionViewExtension

  load_and_authorize_resource :item
  load_and_authorize_resource :category
  decorates_assigned :item

  def revenue_performance_by_category
    data = @category.sales_performance
    render json: data
  end

  def sales_performance_by_category
    items = @category.items

    # Query to get sales performance of all items in the category
    sales_performance = items
                        .joins(:order_items)
                        .select('items.id, items.name, SUM(order_items.quantity) AS total_quantity')
                        .group('items.id, items.name')
                        .pluck('items.name, SUM(order_items.quantity) AS total_quantity')

    render json: sales_performance
  end

  def sales_performance_by_item
    sales_data = @item.sales_performance_by_item(params[:week])

    render json: sales_data
  end
end
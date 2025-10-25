class Admin::ChartsController < ApplicationController
  include MoneyRails::ActionViewExtension

  load_and_authorize_resource :item
  load_and_authorize_resource :menu
  load_and_authorize_resource :category
  decorates_assigned :item, :menu, :category

  ##
  # Category
  # Sales Performance by Category
  def revenue_performance_by_category
    data = @category.sales_performance
    render json: data
  end

  ##
  # Category
  # Sales Performance by Category
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

  ##
  # Item
  # Sales Performance by Item
  def sales_performance_by_item
    # 1. Capture the attribute from URL params, defaulting to :quantity if not present
    requested_attribute = params[:attribute].presence&.to_sym || :quantity

    # 2. Pass the dynamic attribute to the model method
    sales_data_array = @item.sales_performance_by_item({
                                                         week: params[:week],
                                                         month: params[:month], # Pass month param too, for completeness
                                                         attribute: requested_attribute
                                                       })

    # 3. Separate the data into the two arrays ApexCharts requires
    categories = sales_data_array.map(&:first)
    sales_values = sales_data_array.map(&:last)

    # 4. Use the requested attribute for the series name
    render json: {
      categories: categories,
      series: [{
                 name: requested_attribute.to_s.humanize,
                 data: sales_values
               }]
    }

  end

  ##
  # Item
  # Sales Performance by Item
  def item_production_costs
    sales_data = @item.item_production_costs

    # ApexCharts expects separate 'series' (values) and 'labels' (keys)
    render json: {
      series: sales_data.values,
      labels: sales_data.keys
    }
  end

  ##
  # Menu (PIE)
  # Item sale performance
  def sales_performance_by_menu_pie
    items = @menu.items

    # Query to get sales performance of all items in the menu
    sales_performance = items
                        .joins(:order_items)
                        .select('items.id, items.name, SUM(order_items.quantity) AS total_quantity')
                        .group('items.id, items.name')
                        .pluck('items.name, SUM(order_items.quantity) AS total_quantity')

    render json: sales_performance
  end

  ##
  # Menu (Categories PIE)
  # Categories sale performance
  def sales_performance_by_categories_pie
    items = @menu.items

    # Query to get sales performance of all items in the menu
    sales_performance = items
                        .joins(:order_items)
                        .joins(:category)
                        .select('categories.id, categories.name, SUM(order_items.quantity) AS total_quantity')
                        .group('categories.id, categories.name')
                        .pluck('categories.name, SUM(order_items.quantity) AS total_quantity')

    render json: sales_performance
  end

  ##
  # Menu (Categories Column Bar)
  # Categories sale performance
  def revenue_by_category
    data = @menu.revenue_by_category
    render json: data
  end

  ##
  # Menu (Line Bar`)
  # Item sale performance
  def sales_performance_by_menu
    data = @menu.sales_performance_quantity
    render json: data
  end

  ##
  # Menu (Double Bar)
  # Price vs Costs graph
  def price_vs_costs_by_menu
    data = @menu.price_vs_costs

    render json: data
  end

  ##
  # Menu (Double Bar)
  # Costs vs Profit
  def costs_vs_profit_by_menu
    data = @menu.costs_vs_profit

    render json: data
  end
end
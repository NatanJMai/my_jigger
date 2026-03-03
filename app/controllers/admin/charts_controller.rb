class Admin::ChartsController < ApplicationController
  include MoneyRails::ActionViewExtension

  load_and_authorize_resource :item
  load_and_authorize_resource :menu
  load_and_authorize_resource :category
  decorates_assigned :item, :menu, :category

  ##
  # Category
  # Revenue Performance by Category
  def revenue_performance_by_category
    data = @category.sales_performance
    render json: data
  end

  ##
  # Category
  # Sales Performance (Quantity) by the Category's Items
  def sales_performance_by_category
    items = @category.items

    # Query to get sales performance (by quantity) of all items in this specific category
    sales_performance = items
                        .joins(:order_items)
                        .select('items.id, items.name, SUM(order_items.quantity) AS total_quantity')
                        .group('items.id, items.name')
                        .pluck('items.name, SUM(order_items.quantity) AS total_quantity')

    # ApexCharts expects separate 'series' (values) and 'labels' (keys)
    render json: {
      series: sales_performance.map(&:last), # Quantities
      labels: sales_performance.map(&:first) # Item Names
    }
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
                                                         month: params[:month],
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
  # Production Cost Breakdown (PIE)
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

    # ApexCharts expects separate 'series' (values) and 'labels' (keys)
    render json: {
      series: sales_performance.map(&:last), # Quantities
      labels: sales_performance.map(&:first) # Item Names
    }
  end

  ##
  # Menu (Categories PIE)
  # Categories sale performance
  def sales_performance_by_categories_pie
    items = @menu.items
    items = items.where(id: params[:item_ids]) if params[:item_ids].present?

    sales_performance = items
                        .joins(:order_items)
                        .joins(:category)
                        .select('categories.id, categories.name, SUM(order_items.quantity) AS total_quantity')
                        .group('categories.id, categories.name')
                        .pluck('categories.name, SUM(order_items.quantity) AS total_quantity')

    render json: {
      series: sales_performance.map(&:last),
      labels: sales_performance.map(&:first)
    }
  end

  ##
  # Menu (Categories Column Bar)
  # Categories revenue performance
  def revenue_by_category
    data = @menu.revenue_by_category
    render json: data
  end

  ##
  # Menu (Line Bar)
  # Item sale performance (Quantity)
  def sales_performance_by_menu
    items = @menu.items
    items = items.where(id: params[:item_ids]) if params[:item_ids].present?

    data = items.includes(order_items: :order).map do |item|
      {
        name: item.name,
        data: item.sales_performance_by_item({ attribute: :quantity, weekly: true }).to_h
      }
    end

    # Generate a fixed timeline for the last 12 weeks
    start_date = 12.weeks.ago.beginning_of_week.to_date
    end_date = Time.current.end_of_week.to_date
    all_dates = (start_date..end_date).step(7).to_a

    # Format labels for the chart
    labels = all_dates.map { |d| d.strftime('%b %d') }

    series = data.map do |item|
      {
        name: item[:name],
        data: all_dates.map { |date| item[:data][date.strftime('%b %d')] || 0 }
      }
    end

    render json: {
      categories: labels,
      series: series
    }
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

  ##
  # Menu (Mixed Chart)
  # Seller Overview (Orders, Earnings, Costs over time for the menu)
  def seller_overview_performance
    # 1. Retrieve the aggregated data from the Menu model (now contains costs)
    data = @menu.overview_data

    # 2. Build the ApexCharts series structure
    series = [
      {
        name: 'Orders',
        type: 'area',
        data: data[:orders] || []
      },
      {
        name: 'Earnings',
        type: 'bar',
        data: data[:earnings] || [] # Array of monetary values
      },
      {
        # Renamed series to Costs
        name: 'Costs',
        type: 'line',
        data: data[:costs] || [] # Array of monetary values
      }
    ]

    # 3. Render the JSON response
    render json: {
      categories: data[:categories] || [], # e.g., ['Jan', 'Feb', ...]
      series: series
    }
  end

  ##
  # Menu (AI Forecast)
  # Calls GPT-3.5-turbo with the last 12 weeks of sales data and returns
  # 30-day daily predictions per item as JSON.
  # POST /admin/menus/:menu_id/charts/ai_forecast
  def ai_forecast
    items = @menu.items
    items = items.where(id: params[:item_ids]) if params[:item_ids].present?

    # Build the same sales shape the frontend already knows
    start_date = 12.weeks.ago.beginning_of_week.to_date
    end_date   = Time.current.end_of_week.to_date
    all_dates  = (start_date..end_date).step(7).to_a.first(12)
    labels     = all_dates.map { |d| d.strftime('%b %d') }

    series = items.includes(order_items: :order).map do |item|
      weekly = item.sales_performance_by_item({ attribute: :quantity, weekly: true }).to_h
      {
        name: item.name,
        data: all_dates.map { |d| weekly[d.strftime('%b %d')] || 0 }
      }
    end

    forecast = Ai::MenuForecastService.new({ labels: labels, series: series }).generate

    if forecast.empty?
      render json: { error: 'GPT returned no forecast data — please try again.' }, status: :unprocessable_entity
    else
      render json: forecast
    end
  rescue StandardError => e
    Rails.logger.error("ai_forecast error: #{e.message}")
    render json: { error: 'Forecast generation failed. Check server logs.' }, status: :unprocessable_entity
  end
end

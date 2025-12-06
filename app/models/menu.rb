class Menu < ApplicationRecord
  belongs_to :organization, class_name: 'Organization'
  has_many :items, class_name: 'Item'
  has_many :categories, lambda { distinct }, class_name: 'Category', through: :items
  has_many :ai_prompt_logs, class_name: 'AiPromptLog', dependent: :destroy

  validates :name, :organization_id, presence: true

  def ranking_items
    start_date = 1.year.ago
    end_date = Date.today.end_of_month

    items.joins(order_items: :order)
         .where(orders: { date: start_date..end_date })
         .group('items.id')
         .select('items.*, SUM(order_items.quantity) AS total_quantity, SUM(order_items.total_amount_cents) AS total_order_amount')
         .order('total_order_amount DESC, total_quantity DESC')
  end

  ##
  # Return Average Profit of Menu Items
  # OPTIMIZED: Calculates aggregate profit in the database.
  # @return Float
  def average_profit
    # Profit = Customer Price - Costs. Requires joining datasheet_lines.

    # Define a clean subquery for the total profit in cents
    profit_sum = Item
                   .joins(datasheet: :datasheet_lines)
                   .where(menu_id: self.id)
                   .sum(Arel.sql("items.customer_price_cents - (SELECT SUM(dsl.cost_cents * dsl.quantity)
                                                  FROM datasheet_lines dsl
                                                  WHERE dsl.datasheet_id = datasheets.id)"))

    item_count = items.count
    return 0.0 unless item_count.positive?

    # Convert to dollars and divide by item count
    (profit_sum / 100.0) / item_count.to_f
  end

  ##
  # Return Average Quantity Sold of Menu Items
  # OPTIMIZED: Calculates aggregate quantity sold in the database.
  # @return Integer
  def average_quantity_sold
    # Requires joining order_items
    total_quantity = OrderItem
                       .joins(:item)
                       .where(items: { menu_id: self.id })
                       .sum(:quantity)

    item_count = items.count
    return 0 unless item_count.positive?

    total_quantity / item_count
  end

  def categorize_menu_items
    # Calculate averages for popularity (sales count) & profitability (profit per item)
    # NOTE: These calls are now optimized (single query)
    avg_sales = average_quantity_sold || 0
    avg_profit = average_profit || 0

    # Ensure items are eagerly loaded with their total orders and costs to prevent N+1 in the loop
    items_for_analysis = items.includes(:order_items, datasheet: :datasheet_lines)

    items_for_analysis.each do |item|
      # NOTE: item.quantity_sold and item.profit still perform their own DB/Ruby logic.
      # For true optimization, these values should be pre-calculated in the database
      # or cached. Since we don't have the Item model's implementation, we leave these as is.
      popularity = item.quantity_sold
      profitability = item.profit

      # Categorize based on the thresholds
      category =
        if popularity >= avg_sales && profitability >= avg_profit
          'star' # High sales, high profit
        elsif popularity >= avg_sales && profitability < avg_profit
          'plow_horse' # High sales, low profit
        elsif popularity < avg_sales && profitability >= avg_profit
          'puzzle' # Low sales, high profit
        else
          'dog' # Low sales, low profit
        end

      puts "Item: #{item.name} -> Category: #{category}"
      item.update(matrix_category: category) # Save category to database
    end
  end

  def perform_abc_analysis
    # Ensure item data needed for total_value is loaded efficiently before sorting
    menu_items = items.includes(order_items: :order).sort_by { |item| -item.total_value }

    total_revenue = menu_items.sum(&:total_value) # Calculate total revenue from all items
    cumulative_value = 0.0

    menu_items.each do |item|
      cumulative_value += item.total_value
      percentage = (cumulative_value / total_revenue) * 100 # Cumulative percentage

      # Categorize based on cumulative percentage
      abc_category = if percentage <= 70
                       'A'
                     elsif percentage <= 90
                       'B'
                     else
                       'C'
                     end

      puts "Updating #{item.name} to category #{abc_category}"
      item.update(abc_category: abc_category)
    end
  end

  ##
  # Get SUM of total orders of Items
  # OPTIMIZED: Uses a single query.
  # @param attribute (Symbol) - total_amount_cents or quantity
  # @return Integer
  def total_item_orders(attribute = :total_amount_cents)
    OrderItem
      .joins(:item)
      .where(items: { menu_id: self.id })
      .sum(attribute)
  end

  ##
  # Return SUM of costs of all items
  # OPTIMIZED: Uses a single query to get name and total costs.
  # @return [] - [item.name, item.costs]
  def total_item_costs
    Item
      .joins(datasheet: :datasheet_lines)
      .where(menu_id: self.id)
      .group('items.name')
      .pluck(Arel.sql("items.name, SUM(datasheet_lines.cost_cents * datasheet_lines.quantity)"))
  end

  ##
  # Return hash with sales information (total_amount) by date period
  # This remains N queries, one per item, due to the nature of the time-series request.
  # @return Object
  def sales_performance_quantity
    items.includes(order_items: :order).map do |item|
      {
        name: item.name,
        data: item.sales_performance_by_item({ attribute: :quantity }).to_h
      }
    end
  end

  ##
  # Return hash with revenue by Category
  # OPTIMIZED: Calculates revenue by category in one query.
  # @return Object
  def revenue_by_category
    # Query to get total revenue per category for items in this menu
    category_revenue = OrderItem
                         .joins(item: :category)
                         .joins(:order)
                         .where(items: { menu_id: self.id })
                         .group('categories.id', 'categories.name')
                         .pluck(Arel.sql('categories.name, SUM(order_items.total_amount_cents)'))

    # Map results to the required Chartkick format
    values = category_revenue.map do |name, total_cents|
      {
        name: name,
        total: Money.new(total_cents).to_f
      }
    end

    [{ name: 'Total', data: values.map { |item| [item[:name], item[:total]] } }]
  end

  ##
  # Return hash with sales information (total_amount) by date period
  # N+1 issue remains due to calling item.costs/item.profit.
  # @return Object
  def price_vs_costs
    # NOTE: item.costs is still an N+1 query source.
    values = items.map do |item|
      {
        name: item.name,
        price: Money.new(item.customer_price_cents).to_f,
        cost: Money.new(item.costs).to_f
      }
    end

    [{ name: 'Cost', data: values.map { |item| [item[:name], item[:cost]] } },
     { name: 'Price', data: values.map { |item| [item[:name], item[:price]] } }]
  end


  ##
  # Return hash with sales information (total_amount) by date period
  # N+1 issue remains due to calling item.costs/item.profit.
  # @return Object
  def costs_vs_profit
    # NOTE: item.costs and item.profit are still N+1 query sources.
    values = items.map do |item|
      {
        name: item.name,
        cost: Money.new(item.costs).to_f,
        price: Money.new(item.customer_price_cents).to_f,
        profit: Money.new(item.profit).to_f
      }
    end

    [{ name: 'Cost', data: values.map { |item| [item[:name], item[:cost]] } },
     { name: 'Price', data: values.map { |item| [item[:name], item[:price]] } },
     { name: 'Profit', data: values.map { |item| [item[:name], item[:profit]] } }]
  end

  def overview_data
    # Define the 12-month period
    end_date = Time.zone.now.end_of_day
    start_date = 11.months.ago.beginning_of_month

    # 1. Prepare an array of unique month abbreviations for categories
    month_names = (start_date.to_date..end_date.to_date).map { |d| d.strftime('%b') }.uniq

    # Initialize data structures for the 12 periods, setting missing months to zero
    initialized_data = month_names.map { |month| [month, { orders: 0, earnings: 0, costs: 0 }] }.to_h

    # Define the SQL fragment for monthly grouping/ordering once
    month_trunc_sql = Arel.sql("DATE_TRUNC('month', orders.date)")

    # 2. Aggregate monthly performance data in one query
    monthly_performance = OrderItem
                            .joins(order: :organization)
                            .joins(item: :datasheet_lines)
                            .where(items: { menu_id: self.id }) # Scope to items belonging to this menu
                            .where(orders: { date: start_date..end_date, organization_id: organization_id })
                            .group(month_trunc_sql)
                            .order(month_trunc_sql)
                            .select(Arel.sql("
      DATE_TRUNC('month', orders.date) AS period,
      COUNT(DISTINCT orders.id) AS total_orders,
      SUM(order_items.total_amount_cents) AS total_earnings_cents,
      SUM(order_items.quantity * datasheet_lines.cost_cents) AS total_costs_cents
    "))

    # 3. Map the query results into the initialized data hash
    monthly_performance.each do |row|
      month_key = row.period.strftime('%b')

      # Convert cents to dollars for charting
      earnings = (row.total_earnings_cents || 0) / 100.0
      costs = (row.total_costs_cents || 0) / 100.0

      initialized_data[month_key] = {
        orders: row.total_orders.to_i,
        earnings: earnings.to_f,
        costs: costs.to_f
      }
    end

    # 4. Format the final output structure for ApexCharts JavaScript
    {
      categories: month_names,
      orders: initialized_data.values.map { |d| d[:orders] },
      earnings: initialized_data.values.map { |d| d[:earnings] },
      costs: initialized_data.values.map { |d| d[:costs] }
    }
  end
end
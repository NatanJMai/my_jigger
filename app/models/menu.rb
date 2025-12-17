class Menu < ApplicationRecord
  belongs_to :organization, class_name: 'Organization'
  has_many :items, class_name: 'Item'
  has_many :categories, lambda { distinct }, class_name: 'Category', through: :items
  has_many :ai_prompt_logs, class_name: 'AiPromptLog', dependent: :destroy

  validates :name, :organization_id, presence: true

  ##
  # Return ranking of items by sales performance
  # OPTIMIZED: Uses database aggregation with joins
  # @return Scope
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
  # OPTIMIZED: Calculates aggregate profit in the database using correct cost formula.
  # @return Float
  def average_profit
    # Profit = Customer Price - Costs
    # Must use the correct formula: (quantity / volume) * cost_cents

    profit_sum = Item
                   .joins(datasheet: { datasheet_lines: :ingredient })
                   .where(menu_id: self.id)
                   .group('items.id', 'items.customer_price_cents')
                   .pluck(Arel.sql("
                     items.customer_price_cents - SUM((datasheet_lines.quantity::float / ingredients.volume) * ingredients.cost_cents)
                   "))
                   .sum

    item_count = items.count
    return 0.0 unless item_count.positive?

    # Already in cents, convert to dollars and divide by item count
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

  ##
  # Categorize menu items into matrix categories (star, plow_horse, puzzle, dog)
  # OPTIMIZED: Pre-calculates all quantities and profits in single queries
  # FIXED: Uses menu mix percentage for popularity (industry standard)
  # @return void
  def categorize_menu_items
    # Pre-calculate quantities for all items in one query
    quantities = OrderItem
                   .joins(:item)
                   .where(items: { menu_id: self.id })
                   .group('items.id')
                   .sum(:quantity)

    # Calculate total sales for menu mix percentage
    total_quantity_sold = quantities.values.sum.to_f
    return if total_quantity_sold.zero?

    # Pre-calculate profit per unit for all items in one query using correct cost formula
    profit_per_unit = Item
                        .joins(datasheet: { datasheet_lines: :ingredient })
                        .where(menu_id: self.id)
                        .group('items.id')
                        .pluck(Arel.sql("
                          items.id,
                          items.customer_price_cents - SUM((datasheet_lines.quantity::float / ingredients.volume) * ingredients.cost_cents)
                        "))
                        .to_h

    # Calculate averages for comparison
    # Average menu mix = equal distribution across all items
    avg_menu_mix = 100.0 / items.count
    # Average profit per unit
    avg_profit = profit_per_unit.values.sum / items.count.to_f

    # Prepare bulk update data
    categories_to_update = {}

    items.each do |item|
      # Popularity = Menu Mix Percentage (industry standard)
      item_quantity = quantities[item.id] || 0
      popularity = (item_quantity / total_quantity_sold * 100)

      # Profitability = Contribution Margin (profit per unit)
      profitability = profit_per_unit[item.id] || 0

      category = if popularity >= avg_menu_mix && profitability >= avg_profit
                   'star' # High sales, high profit
                 elsif popularity >= avg_menu_mix && profitability < avg_profit
                   'plow_horse' # High sales, low profit
                 elsif popularity < avg_menu_mix && profitability >= avg_profit
                   'puzzle' # Low sales, high profit
                 else
                   'dog' # Low sales, low profit
                 end

      puts "Item: #{item.name} (#{popularity.round(2)}% sales, $#{(profitability/100.0).round(2)} profit) -> Category: #{category}"
      categories_to_update[item.id] = category
    end

    # Bulk update using case statement (single UPDATE query)
    if categories_to_update.any?
      sql_case = categories_to_update.map { |id, cat| "WHEN #{id} THEN '#{cat}'" }.join(' ')

      Item.where(id: categories_to_update.keys).update_all(
        "matrix_category = CASE id #{sql_case} END"
      )
    end
  end

  ##
  # Perform ABC analysis on menu items
  # OPTIMIZED: Pre-calculates all total values in single query
  # @return void
  def perform_abc_analysis
    # Pre-calculate total values for all items in one query
    item_values = OrderItem
                    .joins(:item)
                    .where(items: { menu_id: self.id })
                    .group('items.id')
                    .select('items.id, items.name, SUM(order_items.total_amount_cents) AS total_value_cents')
                    .order('total_value_cents DESC')

    # Calculate total revenue from the same query (total_value_cents is a SELECT alias, not a column)
    # So we need to sum the values after loading, or calculate separately
    total_revenue = item_values.sum { |item| item.total_value_cents.to_f }
    return if total_revenue.zero?

    cumulative_value = 0.0
    categories_to_update = {}

    item_values.each do |item|
      cumulative_value += item.total_value_cents
      percentage = (cumulative_value / total_revenue) * 100

      abc_category = if percentage <= 70
                       'A'
                     elsif percentage <= 90
                       'B'
                     else
                       'C'
                     end

      puts "Updating #{item.name} to category #{abc_category}"
      categories_to_update[item.id] = abc_category
    end

    # Bulk update using case statement (single UPDATE query)
    if categories_to_update.any?
      sql_case = categories_to_update.map { |id, cat| "WHEN #{id} THEN '#{cat}'" }.join(' ')

      Item.where(id: categories_to_update.keys).update_all(
        "abc_category = CASE id #{sql_case} END"
      )
    end
  end

  ##
  # Get SUM of total orders of Items
  # @param attribute (Symbol) - total_amount_cents or quantity
  # @param start_date (Date) - Optional start date for scoping
  # @param end_date (Date) - Optional end date for scoping
  # @return Integer
  def total_item_orders(attribute = :total_amount_cents, start_date: nil, end_date: nil)
    scope = OrderItem.joins(:item).where(items: { menu_id: self.id })

    if start_date && end_date
      scope = scope.joins(:order).where(orders: { date: start_date..end_date })
    end

    scope.sum(attribute)
  end

  ##
  # Return SUM of costs of all items
  # OPTIMIZED: Uses a single query to get name and total costs with correct formula.
  # @return [] - [item.name, item.costs]
  def total_item_costs
    Item
      .joins(datasheet: { datasheet_lines: :ingredient })
      .where(menu_id: self.id)
      .group('items.name')
      .pluck(Arel.sql("
        items.name,
        SUM((datasheet_lines.quantity::float / ingredients.volume) * ingredients.cost_cents)
      "))
  end

  ##
  # Return hash with sales information (total_amount) by date period
  # NOTE: This remains N queries due to time-series nature. Acceptable for <50 items.
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
  # Return hash with price vs costs comparison
  # OPTIMIZED: Pre-calculates all costs in single query with correct formula
  # @return Object
  def price_vs_costs
    # Pre-calculate all costs in one query using correct formula
    item_data = Item
                  .joins(datasheet: { datasheet_lines: :ingredient })
                  .where(menu_id: self.id)
                  .group('items.id', 'items.name', 'items.customer_price_cents')
                  .select(Arel.sql("
                    items.id,
                    items.name,
                    items.customer_price_cents,
                    SUM((datasheet_lines.quantity::float / ingredients.volume) * ingredients.cost_cents) AS total_cost_cents
                  "))

    values = item_data.map do |item|
      {
        name: item.name,
        price: Money.new(item.customer_price_cents).to_f,
        cost: Money.new(item.total_cost_cents || 0).to_f
      }
    end

    [
      { name: 'Cost', data: values.map { |item| [item[:name], item[:cost]] } },
      { name: 'Price', data: values.map { |item| [item[:name], item[:price]] } }
    ]
  end

  ##
  # Return hash with costs vs profit comparison
  # OPTIMIZED: Pre-calculates all costs and profits in single query with correct formula
  # @return Object
  def costs_vs_profit
    # Pre-calculate all costs and profits in one query using correct formula
    item_data = Item
                  .joins(datasheet: { datasheet_lines: :ingredient })
                  .where(menu_id: self.id)
                  .group('items.id', 'items.name', 'items.customer_price_cents')
                  .select(Arel.sql("
                    items.id,
                    items.name,
                    items.customer_price_cents,
                    SUM((datasheet_lines.quantity::float / ingredients.volume) * ingredients.cost_cents) AS total_cost_cents
                  "))

    values = item_data.map do |item|
      cost = item.total_cost_cents.to_f || 0
      price = item.customer_price_cents.to_f
      profit = price - cost

      {
        name: item.name,
        cost: Money.new(cost).to_f,
        price: Money.new(price).to_f,
        profit: Money.new(profit).to_f
      }
    end

    [
      { name: 'Cost', data: values.map { |item| [item[:name], item[:cost]] } },
      { name: 'Price', data: values.map { |item| [item[:name], item[:price]] } },
      { name: 'Profit', data: values.map { |item| [item[:name], item[:profit]] } }
    ]
  end

  ##
  # Return overview data with monthly breakdown of orders, earnings, and costs
  # OPTIMIZED: Uses efficient queries with proper grouping
  # @return Hash
  def overview_data
    end_date = Time.zone.now.end_of_day
    start_date = 11.months.ago.beginning_of_month

    # Generate all month labels for the period
    month_names = []
    current = start_date.to_date
    while current <= end_date.to_date
      month_names << current.strftime('%b')
      current = current.next_month.beginning_of_month
    end
    month_names.uniq!

    # Initialize data structure with zeros
    initialized_data = month_names.map { |month| [month, { orders: 0, earnings: 0, costs: 0 }] }.to_h

    # CRITICAL FIX: Calculate item costs using proper formula from DatasheetLine#calculated_price
    # Formula: (quantity / volume) * cost_cents for each ingredient
    item_costs_data = Item
                        .joins(datasheet: { datasheet_lines: :ingredient })
                        .where(menu_id: self.id)
                        .group('items.id')
                        .pluck(
                          Arel.sql('items.id'),
                          Arel.sql('SUM((datasheet_lines.quantity::float / ingredients.volume) * ingredients.cost_cents)')
                        )

    item_costs = item_costs_data.to_h

    # Get monthly aggregated data grouped by month AND item
    monthly_data = OrderItem
                     .joins(:order, :item)
                     .where(orders: {
                       date: start_date..end_date,
                       organization_id: organization_id
                     })
                     .where(items: { menu_id: self.id })
                     .group("DATE_TRUNC('month', orders.date)", "items.id")
                     .select(
                       "DATE_TRUNC('month', orders.date) AS period",
                       "items.id AS item_id",
                       "SUM(order_items.quantity) AS item_quantity",
                       "SUM(order_items.total_amount_cents) AS item_earnings_cents"
                     )

    # Process the data
    monthly_summary = {}

    monthly_data.each do |row|
      month_key = row.period.strftime('%b')

      # Initialize month if not exists
      monthly_summary[month_key] ||= {
        earnings: 0,
        costs: 0,
        quantities_by_item: Hash.new(0)
      }

      # Accumulate earnings (convert from cents to dollars)
      monthly_summary[month_key][:earnings] += (row.item_earnings_cents.to_f / 100.0)

      # Track quantities by item for cost calculation
      monthly_summary[month_key][:quantities_by_item][row.item_id] += row.item_quantity.to_i
    end

    # Calculate costs based on quantities sold * recipe cost per item
    monthly_summary.each do |month_key, data|
      data[:quantities_by_item].each do |item_id, quantity_sold|
        recipe_cost_cents = item_costs[item_id] || 0
        # quantity_sold * cost_per_recipe / 100 to convert to dollars
        data[:costs] += (quantity_sold * recipe_cost_cents / 100.0)
      end
    end

    # Get unique order counts per month
    order_counts = Order
                     .where(
                       date: start_date..end_date,
                       organization_id: organization_id
                     )
                     .joins(:order_items)
                     .where(order_items: { item_id: items.select(:id) })
                     .group("DATE_TRUNC('month', orders.date)")
                     .count

    order_counts.each do |period, count|
      month_key = period.strftime('%b')
      initialized_data[month_key][:orders] = count if initialized_data[month_key]
    end

    # Merge the calculated data into initialized_data
    monthly_summary.each do |month_key, data|
      if initialized_data[month_key]
        initialized_data[month_key][:earnings] = data[:earnings].round(2)
        initialized_data[month_key][:costs] = data[:costs].round(2)
      end
    end

    # Return formatted output
    {
      categories: month_names,
      orders: initialized_data.values.map { |d| d[:orders] },
      earnings: initialized_data.values.map { |d| d[:earnings] },
      costs: initialized_data.values.map { |d| d[:costs] }
    }
  end
end
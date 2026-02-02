class Item < ApplicationRecord
  include ClassyEnum::ActiveRecord
  include ItemsHelper

  monetize :customer_price_cents, allow_nil: true

  belongs_to :menu, class_name: 'Menu', optional: true
  belongs_to :organization, class_name: 'Organization'
  belongs_to :category, class_name: 'Category', optional: true

  has_one :datasheet, class_name: 'Datasheet', dependent: :destroy
  has_many :datasheet_lines, through: :datasheet, class_name: 'DatasheetLine'
  has_many :order_items, class_name: 'OrderItem', dependent: :destroy
  has_many :orders, through: :order_items, class_name: 'Order', dependent: :destroy
  has_many :ingredients, class_name: 'Ingredient', dependent: :destroy

  mount_uploader :image, ImageUploader

  validates :name, :organization_id, presence: true

  before_save :set_normalized_name
  after_create :create_datasheet

  ##
  # Return only active items
  # @return Scope
  scope :only_active, lambda {
    where(status: true)
  }

  ##
  # Return best five items
  # @return Scope
  scope :best_five, lambda {
    where(status: true).limit(5)
  }

  ##
  # Return Matrix category items
  # @param category String
  # @return Scope
  scope :matrix_category, lambda { |category|
    where(matrix_category: category) if category.present?
  }

  ##
  # Return the best day or month for item sales
  # @return Array - [date_string, value] or nil
  def best_day_month
    sales = sales_performance_by_item(week: false)
    sales.to_h&.max_by { |_key, value| value }
  end

  ##
  # Item price - costs
  # @return Integer
  def profit
    customer_price_cents - costs
  end

  ##
  # Return ABC Category if present
  # @return String
  def get_abc_category
    abc_category
  end

  ##
  # Return ABC CSS Class
  # @return String
  def get_abc_class
    case abc_category
    when 'A'
      'green'
    when 'B'
      'orange'
    when 'C'
      'red'
    else
      'grey'
    end
  end

  ##
  # Calculate markup percentage (profit / price * 100)
  # @return Float
  def markup_percentage
    return 0 if customer_price_cents.zero? # Avoid division by zero

    (profit / customer_price_cents) * 100
  end

  ##
  # Item costs
  # @return Integer
  def costs
    datasheet_lines.map(&:calculated_price).sum
  end

  ##
  # Return item costs as percentage (CMV)
  # @return Float
  def costs_percentage
    datasheet.calculate_cmv
  end

  ##
  # Alias for costs_percentage (CMV)
  # @return Float
  def cmv
    costs_percentage
  end

  ##
  # Return Total (attribute) information
  # @param options (Hash) - options
  # :week - Weekly report
  # :month - Monthly report
  # :attribute - Order Item (:quantity or :total_amount_cents)
  # :total_amount_cents - Order Item Total Amount report
  # @return Integer
  def total_orders(options = {})
    week = options[:week].present?
    month = options[:month].present?
    attribute = options[:attribute].presence || :quantity

    start_date, end_date = if week
                             [Date.today.beginning_of_week, Date.today.end_of_week]
                           elsif month
                             [Date.today.beginning_of_month, Date.today.end_of_month]
                           else
                             [1.year.ago, Date.today]
                           end

    order_items
      .joins(:order)
      .where(orders: { date: start_date..end_date })
      .sum(attribute)
  end

  ##
  # Production costs of Item (percentage)
  # @return [] - ['Gin', 20.0]
  def item_production_costs
    total_cost = costs
    datasheet_lines.map do |line|
      percentage = (line.calculated_price / total_cost) * 100
      [line.name, percentage.round(1)]
    end.to_h
  end

  ##
  # Return sales performance by item
  # @param options (Hash) - options
  # :week - Weekly report
  # :month - Monthly report
  # :attribute - Order Item (:quantity or :total_amount_cents)
  # :total_amount_cents - Order Item Total Amount report
  # @return Object []
  def sales_performance_by_item(options = {})
    attribute = options[:attribute].presence || :quantity
    weekday = options[:week]
    monthly = options[:month] # Capture the separate :month option

    start_date, end_date = if weekday
                             [Date.current.beginning_of_week, Date.current.end_of_week]
                           elsif monthly
                             [Date.current.beginning_of_month, Date.current.end_of_month]
                           else
                             # Default to month if neither is specified, or adjust as needed
                             [Date.current.beginning_of_month, Date.current.end_of_month]
                           end

    # The attribute column is used directly in the SUM function
    str = "SUM(order_items.#{attribute})"

    # Query to get sales data
    sales = order_items
            .where(item_id: id)
            .joins(:order)
            # Use Date.current for safety, though Date.today often works
            .where(orders: { date: start_date..end_date })
            .group('DATE(orders.date)')
            .select("DATE(orders.date) as sale_date, #{str} as total_sales")

    sales_hash = sales.to_a.pluck(:sale_date, :total_sales).to_h

    # Determine if we should pass the 'week' flag to format_sales_data
    # If 'month' is true and 'week' is false/nil, you likely want to pass 'week: false'
    # or handle it based on the period derived above.
    period_flag = if weekday
                    { week: true }
                  else
                    { week: false } # Indicates a period longer than a week (like a month)
                  end

    # format_sales_data handles filling in missing dates with zero/nil values
    format_sales_data(start_date,
                      end_date,
                      sales_hash,
                      period_flag.merge({
                                          money: attribute == :total_amount_cents
                                        }))
  end

  ##
  # Format Sales data to send to Chartkick graphs
  # @param start_date Date
  # @param end_date Date
  # @param sales_hash (Hash) - Hash object from sales performance method
  # @param options Hash
  # - week: date format %A - Monday, Tuesday, etc.
  # - money: money string from cents - 20.00, etc.
  # @return [[]]
  def format_sales_data(start_date, end_date, sales_hash, options = {})
    weekday = options[:week].present?
    money = options[:money].present?

    (start_date..end_date).map do |date|
      date_str = if weekday
                   date.strftime('%A')
                 else
                   date.to_s
                 end

      hash_str = if money
                   money_graph_label(sales_hash[date] || 0)
                 else
                   sales_hash[date] || 0
                 end

      [date_str, hash_str]
    end
  end

  ##
  # Return total value sold for each item
  # @return Float
  def total_value
    total_orders(attribute: :total_amount_cents)
  end

  ##
  # Return total quantity sold for each item
  # @return Integer
  def quantity_sold
    total_orders(attribute: :quantity)
  end

  private

  def set_normalized_name
    self.normalized_name = normalize_string(name)
    self.name = normalized_name.titleize
  end

  def create_datasheet
    return if datasheet.present?

    self.datasheet = Datasheet.create(item: self, name: 'New Datasheet')
    save!
  end
end

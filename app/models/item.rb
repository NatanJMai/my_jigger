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
  # Return best five items
  # @return Scope
  scope :best_five, lambda {
    where(status: true).limit(5)
  }

  def best_day_month
    sales = sales_performance_by_item(week: false)
    value = sales.to_h&.max_by { |_key, value| value }
    value
  end

  # @param options (Hash) - options
  # :week - Weekly report
  # :attribute - Order Item (:quantity or :total_amount_cents)
  # :total_amount_cents - Order Item Total Amount report
  # @return Integer
  def total_orders(options = {})
    week = options[:week].present?
    attribute = options[:attribute].presence || :quantity

    start_date, end_date = if week
                             [Date.today.beginning_of_week, Date.today.end_of_week]
                           else
                             [Date.today.beginning_of_month, Date.today.end_of_month]
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
    total_cost = datasheet_lines.sum(:cost_cents)
    datasheet_lines.pluck(:name, :cost_cents).map do |name, cost_cents|
      percentage = (cost_cents.to_f / total_cost) * 100
      [name, percentage.round(1)]
    end
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

    start_date, end_date = if weekday
                             [Date.today.beginning_of_week, Date.today.end_of_week]
                           else
                             [Date.today.beginning_of_month, Date.today.end_of_month]
                           end

    str = "SUM(order_items.#{attribute.to_s})"

    # Query to get sales data
    sales = order_items
            .where(item_id: self.id)
            .joins(:order)
            .where(orders: { date: start_date..end_date })
            .group('DATE(orders.date)')
            .select("DATE(orders.date) as sale_date, #{str} as total_sales")

    sales_hash = sales.to_a.pluck(:sale_date, :total_sales).to_h

    # [["01-01-Jan", 10], ["01-01-Feb", 15], ["01-01-Mar", 25]]
    format_sales_data(start_date,
                      end_date,
                      sales_hash,
                      {
                        week: weekday,
                        money: attribute == :total_amount_cents
                      })
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
                   date.strftime("%A")
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

class Item < ApplicationRecord
  include ClassyEnum::ActiveRecord

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

  # Instance method for sales performance of a single item
  def sales_performance
    # Define the month you are working with (example: January 2025)
    start_date = Date.new(2025, 1, 1)
    end_date = start_date.end_of_month

    # Generate all dates within the month
    all_dates = (start_date..end_date).to_a

    # Query to get sales data
    sales = order_items
              .where(item_id: id)
              .joins(:order)
              .where(orders: { date: start_date..end_date })
              .group("DATE(orders.date)")
              .select("DATE(orders.date) as sale_date, SUM(order_items.quantity) as total_sales")

    # Create a hash for sales data with all dates and corresponding sales, if any
    sales_data = all_dates.map do |date|
      sales_for_date = sales.find { |record| record.sale_date.to_date == date }
      [date.to_s, sales_for_date ? sales_for_date.total_sales : 0] # If no sales, set to 0
    end

    sales_data
  end

  private

  def set_normalized_name
    self.normalized_name = normalize_string(name)
    self.name = normalized_name.titleize
  end

  def create_datasheet
    return if datasheet.present?

    self.datasheet = Datasheet.create(item: self, name: 'New Datasheet')
    save
  end
end

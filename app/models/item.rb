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

  def sales_performance_by_item(week = false)
    start_date, end_date = if week
                             [Date.today.beginning_of_week, Date.today.end_of_week]
                           else
                             [Date.today.beginning_of_month, Date.today.end_of_month]
                           end

    # Query to get sales data
    sales = order_items
            .where(item_id: self.id)
            .joins(:order)
            .where(orders: { date: start_date..end_date })
            .group('DATE(orders.date)')
            .select('DATE(orders.date) as sale_date, SUM(order_items.quantity) as total_sales')

    sales_hash = sales.to_a.pluck(:sale_date, :total_sales).to_h

    sales_data = (start_date..end_date).map do |date|
      date_str = if week
                   date.strftime("%A")
                 else
                   date.to_s
                 end

      [date_str, sales_hash[date] || 0] # 0 if no sales on a given date
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
    save!
  end
end

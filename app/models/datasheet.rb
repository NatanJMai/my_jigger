class Datasheet < ApplicationRecord
  belongs_to :item, class_name: 'Item'
  has_many :datasheet_lines, class_name: 'DatasheetLine', dependent: :destroy
  validates :item_id, presence: true

  ##
  # FIXME: use send(:attribute)
  # Returns sum of Datasheet Lines attribute
  # @param attribute (String)
  # @return Decimal
  def get_total_qtd(attribute)
    case attribute
    when 'quantity'
      datasheet_lines.sum(:quantity)
    else
      0.0
    end
  end

  ##
  # Returns CMV of Datasheet from given value (Customer Price)
  # @param value (Decimal)
  # @return Decimal
  def calculate_cmv(value = 0.0)
    return 0.0 unless value.positive?

    total = (total_costs.to_f / value.to_f) * 100
    total.round(2)
  end

  ##
  # Returns CMV Class of a value.
  # If value <= 30 then Green,
  # if value between 30 and 35 Yellow,
  # Otherwise Red.
  # @param value (Decimal)
  # @return String
  def cmv_class_color(value = 0.0)
    if value <= 30.0
      'cmv-green'
    elsif value > 30.0 && value <= 35
      'cmv-yellow'
    else
      'cmv-red'
    end
  end

  ##
  # Returns Total Price of Datasheet
  # Sum of all Datasheet Lines
  # @return Decimal
  def total_costs
    datasheet_lines.sum { |line| line.calculated_price.to_f }
  end
end

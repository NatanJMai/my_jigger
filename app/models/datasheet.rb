class Datasheet < ApplicationRecord
  belongs_to :item, class_name: "Item"
  has_many :datasheet_lines, class_name: "DatasheetLine", dependent: :destroy
  validates :name, :item_id, presence: true

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

  def get_total_price
    datasheet_lines.map(&:calculated_price).sum
  end
end

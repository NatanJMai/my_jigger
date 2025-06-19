# frozen_string_literal: true

module ApplicationHelper
  include Pagy::Frontend

  ##
  # Return Date label
  # @param str String
  # @param attribute DateTime
  # @return String
  def date_label(str, attribute)
    "#{str} #{attribute.strftime('%B %d, %Y')}"
  end

  ##
  # Normalize string
  # @param str String
  # @return String
  def normalize_string(str)
    str = str.to_s.downcase.strip          # Lowercase and trim
    str = I18n.transliterate(str)          # Remove accents
    str.gsub(/[^a-z0-9\s]/, ' ')           # Replace special characters with space
       .gsub(/\s+/, ' ')                   # Replace multiple spaces with a single space
  end

  ##
  # Titleize string, usually used in before save
  # @return String
  def titleize_string(str)
    str.titleize
  end

  ##
  # Return string Money
  # @return String
  def money_graph_label(str)
    money = Money.new(str)
    "#{money}"
  end
end

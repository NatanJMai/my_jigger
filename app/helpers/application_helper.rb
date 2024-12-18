# frozen_string_literal: true

module ApplicationHelper
  ##
  # Return Date label
  # @param str String
  # @param attribute DateTime
  # @return String
  def date(str, attribute)
    "#{str} #{attribute.strftime('%a %m/%d/%y')}"
  end
end

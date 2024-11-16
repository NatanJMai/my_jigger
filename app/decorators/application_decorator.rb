class ApplicationDecorator < Draper::Decorator
  # Define methods for all decorated objects.
  # Helpers are accessed through `helpers` (aka `h`). For example:
  #
  #   def percent_amount
  #     h.number_to_percentage object.amount, precision: 2
  #   end

  ##
  # Return HTML label for boolean attribute
  # @param attribute String
  # @return String
  def boolean_label(attribute, label = { true => 'Active', false => 'Inactive' })
    s = attribute ? label[true] : label[false]
    "<div class='align-center boolean-label #{attribute ? 'active' : 'inactive'}'>#{s}</div>".html_safe
  end

  ##
  # Returns CSS Label (status) Style
  # @return String
  def status_label
    object.status? ? 'active-status' : 'inactive-status'
  end
end

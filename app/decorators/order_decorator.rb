class OrderDecorator < ApplicationDecorator
  delegate_all

  ##
  # Return Item names from Order Items
  # @return String
  def display_items
    items.map do |item|
      "<a class='item-link' href='#{Rails.application.routes.url_helpers.admin_item_path(item)}'>#{ERB::Util.html_escape(item.name)}</a>"
    end.join(', ').html_safe
  end
end

class ItemDecorator < ApplicationDecorator
  delegate_all

  # Define presentation-specific methods here. Helpers are accessed through
  # `helpers` (aka `h`). You can override attributes, for example:
  #
  #   def created_at
  #     helpers.content_tag :span, class: 'time' do
  #       object.created_at.strftime("%a %m/%d/%y")
  #     end
  #   end

  ##
  # Return label of Best Day
  # e.g Wednesday, 22nd January
  # @return String
  def best_day_label
    value = best_day_month
    best_day_format(value[0], value[1])
  end

  ##
  # Return Item name with link
  # @return String
  def display_item_link
    "<a class='item-link' href='#{Rails.application.routes.url_helpers.admin_item_path(id)}'>#{ERB::Util.html_escape(name)}</a>".html_safe
  end
end

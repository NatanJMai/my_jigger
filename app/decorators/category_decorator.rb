class CategoryDecorator < ApplicationDecorator
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
  # Return Item name with link
  # @return String
  def display_category_link
    "<a class='item-link' href='#{Rails.application.routes.url_helpers.admin_category_path(id)}'>#{ERB::Util.html_escape(name)}</a>".html_safe
  end
end

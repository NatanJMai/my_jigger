class MenuDecorator < ApplicationDecorator
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
  # Returns CSS Label (status) Style
  # @return String
  def released_at
    h.date('Released On:', release_date) if release_date.present?
  end

  ##
  # Returns CSS Label (status) Style
  # @return String
  def status_css_label
    status? ? 'active-status' : 'inactive-status'
  end
end

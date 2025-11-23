module ItemsHelper
  require 'date'

  def best_day_format(date, value)
    date = Date.parse(date)

    formatted_week_date = date.strftime('%A')
    formatted_date = "#{date.day}/#{date.strftime('%B')}"

    str = <<~TEXT
      #{formatted_week_date}
    TEXT

    str.html_safe
  end
end

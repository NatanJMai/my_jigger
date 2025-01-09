module ItemsHelper
  require 'date'

  def best_day_format(date, value)
    date = Date.parse(date)

    formatted_week_date = date.strftime('%A')
    formatted_date = "#{date.day}/#{date.strftime('%B')}"

    str = <<~TEXT
      <div class='date-calendar'>#{formatted_week_date}</div>
      <div class='date-str'>#{formatted_date} - #{value} sales </div>
    TEXT

    str.html_safe
  end
end

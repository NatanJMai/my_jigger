module StatisticsHelper
  def sales_performance_by_item(item)
    line_chart sales_performance_by_item_admin_item_charts_path(item), library: {
      title: {text: 'Competitions by year', x: -20},
      yAxis: {
        crosshair: true,
        title: {
          text: 'Competitions count'
        }
      },
      xAxis: {
        crosshair: true,
        title: {
          text: 'Year'
        }
      }
    }
  end

  def sales_performance_by_category(category)
    line_chart sales_performance_by_category_admin_category_charts_path(category)
  end
end

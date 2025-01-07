module StatisticsCategoryHelper
  def monthly_revenue_performance(category)
    colors = %w[#005B96 #6497B1 #FF6F61 #6B4226 #FFD662]

    area_chart revenue_performance_by_category_admin_category_charts_path(category),
               title: 'Monthly Revenue Performance',
               colors: colors,
               library: {
                 scales: {
                   y: {
                     ticks: { stepSize: 5 },
                     title: {
                       display: true,
                       text: 'Sales Quantity',
                       color: 'gray',
                       font: { size: 12 }
                     }
                   }
                 },

                 elements: {
                   bar: {
                     borderRadius: 2,
                     borderWidth: 1
                   }
                 },

                 animation: {
                   duration: 1500,
                   easing: 'easeInOutQuart'
                 },

                 plugins: {
                   title: {
                     display: true,
                     padding: {
                       bottom: 25
                     }
                   }
                 }
               }
  end

  def sales_performance_by_category(category)
    pie_chart sales_performance_by_category_admin_category_charts_path(category),
              title: 'Sales Performance By Category',
              library: {
                animation: {
                  duration: 1500,
                  easing: 'easeInOutQuart'
                }
              }
  end
end

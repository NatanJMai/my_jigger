module StatisticsCategoryHelper
  def monthly_revenue_performance(category)
    colors = %w[#005B96 #6497B1 #FF6F61 #6B4226 #FFD662]

    area_chart revenue_performance_by_category_admin_category_charts_path(category),
               title: 'Monthly Revenue Performance',
               colors: colors,
               suffix: "$",
               library: {
                 scales: {
                   y: {
                     ticks: { stepSize: 5 },
                     title: {
                       display: true,
                       text: 'Sales Quantity ($)',
                       color: 'gray',
                       font: { size: 12 }
                     }
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
              legend: "bottom",
              download: { background: '#ffffff' },
              suffix: " items",
              library: {
                plugins: {
                  legend: {
                    labels: {
                      font: {
                        size: 10
                      }
                    }
                  }
                },
                rotation: 10,
                animation: {
                  duration: 1500,
                  easing: 'easeInOutQuart'
                }
              }
  end
end

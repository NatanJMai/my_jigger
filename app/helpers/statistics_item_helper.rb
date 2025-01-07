module StatisticsItemHelper
  def sales_performance_by_item(item)
    area_chart sales_performance_by_item_admin_item_charts_path(item),
               download: { background: '#ffffff' },
               library: {
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
               },
               title: 'Sales Performance'
  end

  def sales_performance_by_item_weekly(item)
    colors = %w[#005B96 #6497B1 #FF6F61 #6B4226 #FFD662]

    column_chart sales_performance_by_item_admin_item_charts_path(item, week: true),
                 colors: colors,
                 title: 'Item Performance (Week)',
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
end

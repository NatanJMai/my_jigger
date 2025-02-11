module StatisticsItemHelper
  def item_production_costs(item)
    pie_chart item_production_costs_admin_item_charts_path(item),
              suffix: '%',
              donut: true,
              legend: 'bottom',
              download: { background: '#ffffff' },

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
              },
              title: 'Item Production Costs'
  end


  def sales_performance_by_item(item)
    colors = %w[#7570B3 #E7298A #66A61E #E6AB02 #A6761D #666666]
    area_chart sales_performance_by_item_admin_item_charts_path(item),
               download: { background: '#ffffff' },
               colors: colors,
               suffix: ' items',
               library: {
                 scales: {
                   y: {
                     ticks: { stepSize: 5 }
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
               },
               title: 'Sales Performance (Month)'
  end

  def sales_performance_by_item_weekly(item)
    bar_chart sales_performance_by_item_admin_item_charts_path(item, week: true),
              colors: ['#FFA834'],
              title: 'Item Performance (Current Week)',
              suffix: ' items',
              library: {
                scales: {
                  x: {
                    ticks: { stepSize: 5 },
                    title: { display: false }
                  }
                },
                barThickness: 15,

                animation: {
                  duration: 1500,
                  easing: 'easeInOutQuart'
                },

                plugins: {
                  title: {
                    padding: {
                      bottom: 25
                    }
                  }
                }
              }
  end
end

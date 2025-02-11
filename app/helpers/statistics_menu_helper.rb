module StatisticsMenuHelper
  def menu_sales_pie(menu)
    colors = %w[#74A9CF #3690C0 #0570B0 #045A8D #023858]
    pie_chart sales_performance_by_menu_pie_admin_menu_charts_path(menu),
              colors: colors,
              title: 'Sales Performance By Menu',
              legend: 'bottom',
              download: { background: '#ffffff' },
              suffix: ' items',
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

  def categories_sales_pie(menu)
    colors = %w[#FD8D3C #FC4E2A #E31A1C #BD0026 #800026]
    pie_chart sales_performance_by_categories_pie_admin_menu_charts_path(menu),
              title: 'Sales Performance By Categories',
              legend: 'bottom',
              colors: colors,
              donut: true,
              download: { background: '#ffffff' },
              suffix: '',
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

  def revenue_by_category(menu)
    column_chart revenue_by_category_admin_menu_charts_path(menu),
                 title: 'Revenue By Categories',
                 colors: ['#B15928'],
                 legend: 'bottom',
                 prefix: '$',
                 library: {
                   barThickness: 20,
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

  def sales_performance_by_menu(menu)
    colors = %w[#F69C14 #EE3153 #31EE39 #1464F6 #31EED8]
    line_chart sales_performance_by_menu_admin_menu_charts_path(menu),
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

  def price_vs_costs(menu)
    colors = %w[#F781BF #8A81F7]
    bar_chart price_vs_costs_by_menu_admin_menu_charts_path(menu),
              stacked: true,
              prefix: '$',
              colors: colors,
              library: {
                indexAxis: 'y',
                barThickness: 10,
                animation: {
                  duration: 1500,
                  easing: 'easeInOutQuart'
                }
              }, title: 'Cost vs Price'
  end

  def cost_vs_profit(menu)
    colors = %w[#666666 #A6761D #E6AB02]
    column_chart costs_vs_profit_by_menu_admin_menu_charts_path(menu),
                 stacked: false,
                 prefix: '$',
                 colors: colors,
                 library: {
                   indexAxis: 'x',
                   barThickness: 10,
                   animation: {
                     duration: 1500,
                     easing: 'easeInOutQuart'
                   }
                 }, title: 'Cost vs Price'
  end
end

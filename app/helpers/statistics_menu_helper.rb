module StatisticsMenuHelper
  def menu_sales_pie(menu)
    pie_chart sales_performance_by_menu_pie_admin_menu_charts_path(menu),
              title: 'Sales Performance By Menu',
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

  def categories_sales_pie(menu)
    pie_chart sales_performance_by_categories_pie_admin_menu_charts_path(menu),
              title: 'Sales Performance By Categories',
              legend: "bottom",
              download: { background: '#ffffff' },
              suffix: "",
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
                 colors: ['#9087FC'],
              legend: "bottom",
              prefix: "$",
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

  def sales_performance_by_menu(menu)
    line_chart sales_performance_by_menu_admin_menu_charts_path(menu),
               download: { background: '#ffffff' },
               suffix: " items",
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
    colors = %w[#FFCCCB #ADD8E6]
    bar_chart price_vs_costs_by_menu_admin_menu_charts_path(menu),
              stacked: true,
              prefix: "$",
              colors: colors,
              library: {
                indexAxis: 'y',
                barThickness: 15,
              }, title: 'Cost vs Price'
  end

  def cost_vs_profit(menu)
    colors = %w[#FFCCCB #ADD8E6 #90EE90]
    column_chart costs_vs_profit_by_menu_admin_menu_charts_path(menu),
              stacked: false,
              prefix: "$",
              colors: colors,
              library: {
                indexAxis: 'x',
                barThickness: 15,
              }, title: 'Cost vs Price'
  end
end

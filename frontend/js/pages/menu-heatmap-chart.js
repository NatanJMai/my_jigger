/**
 * menu-heatmap-chart.js
 * Renders a heatmap (item × week) using ApexCharts' native heatmap type.
 * Fetches from the same sales_performance_by_menu endpoint as the line chart.
 *
 * Expected JSON shape (same endpoint):
 *   { categories: ['Mar 04', 'Mar 11', …], series: [{ name, data: [n, n, …] }] }
 */
import { CustomApexChart, ins } from '../app'

function initHeatmapChart() {
  const container = document.getElementById('menu-sales-heatmap-container')
  if (!container) return

  const endpoint = container.dataset.chartEndpoint
  const loading  = document.getElementById('menu-heatmap-loading')

  if (!endpoint) {
    if (loading) loading.remove()
    container.innerHTML = '<div class="text-center text-danger p-4">Heatmap endpoint missing.</div>'
    return
  }

  fetch(endpoint)
    .then(r => { if (!r.ok) throw new Error('Network error'); return r.json() })
    .then(data => {
      if (loading) loading.remove()

      const series     = data.series     || []
      const categories = data.categories || []

      if (!series.length) {
        container.innerHTML = '<div class="text-center text-muted p-4">No sales data available yet.</div>'
        return
      }

      // ApexCharts heatmap: each series = one ROW (one item).
      // series[i].data must be an array of numbers matching categories length.
      // We sort items by total descending so top sellers appear at the top.
      const sorted = [...series].sort((a, b) => {
        const sumA = a.data.reduce((s, v) => s + v, 0)
        const sumB = b.data.reduce((s, v) => s + v, 0)
        return sumB - sumA
      })

      // Dynamic height: ~36 px per row + 80 px for axes/legend
      const chartHeight = Math.max(280, sorted.length * 36 + 80)

      new CustomApexChart({
        selector: '#menu-sales-heatmap-container',
        options: () => ({
          chart: {
            type: 'heatmap',
            height: chartHeight,
            toolbar: { show: false },
            animations: { enabled: true, speed: 600 }
          },
          series: sorted,
          dataLabels: {
            enabled: sorted.length <= 10,   // hide numbers when there are many rows
            style: { fontSize: '11px', fontWeight: 500 }
          },
          // Monochrome blue scale — matches the existing monochrome pie theme
          plotOptions: {
            heatmap: {
              shadeIntensity: 0.6,
              radius: 4,
              colorScale: {
                ranges: [
                  { from: 0,   to: 0,   color: '#f0f2f5', name: 'Zero'  },
                  { from: 1,   to: 20,  color: '#bdd7f5', name: 'Low'   },
                  { from: 21,  to: 50,  color: '#5da6e8', name: 'Mid'   },
                  { from: 51,  to: 100, color: '#1a6fbd', name: 'High'  },
                  { from: 101, to: 999, color: '#0a3d6b', name: 'Peak'  }
                ]
              }
            }
          },
          xaxis: {
            categories,
            labels: { rotate: -35, style: { fontSize: '11px' } },
            tooltip: { enabled: false }
          },
          yaxis: {
            labels: { style: { fontSize: '12px' } }
          },
          legend: {
            show: true,
            position: 'bottom',
            horizontalAlign: 'center',
            fontSize: '12px'
          },
          tooltip: {
            y: {
              formatter: (val) => `${val} units`
            }
          },
          grid: { padding: { right: 20 } }
        })
      })
    })
    .catch(err => {
      console.error('Heatmap error:', err)
      if (loading) loading.remove()
      container.innerHTML = `<div class="text-center text-danger p-4">Failed to load heatmap: ${err.message}</div>`
    })
}

document.addEventListener('turbo:load', initHeatmapChart)
document.addEventListener('DOMContentLoaded', initHeatmapChart)

/**
 * Template Name: UBold - Admin & Dashboard Template
 * By (Author): Coderthemes
 * Module/App (File Name): ECommerce Seller Details
 */
import { CustomApexChart, ins } from '../app'

document.addEventListener('turbo:load', function() {
  // 1. Find the chart container
  const chartContainer = document.getElementById('seller-revenue');

  // CRITICAL: Check for element existence
  if (!chartContainer) return;

  const endpoint = chartContainer.dataset.chartEndpoint;

  // Create and insert a loading state element if needed (or assume it's in the HTML)
  let loadingText = document.getElementById('seller-revenue-loading');

  if (!endpoint) {
    console.error("Endpoint not found for seller revenue chart.");
    if (loadingText) loadingText.remove();
    chartContainer.innerHTML = '<div class="text-center text-danger p-5">Chart data endpoint is missing.</div>';
    return;
  }

  // 2. Define the static base options (pulled from your original code)
  const baseOptions = {
    chart: {
      height: 370,
      type: "line",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "straight",
      dashArray: [0, 0, 8],
      width: [2, 0, 2.2],
    },
    fill: {
      opacity: [0.1, 0.9, 1],
    },
    markers: {
      size: [0, 0, 0],
      strokeWidth: 2,
      hover: {
        size: 4,
      },
    },
    // Keep a placeholder xaxis structure for merging dynamic categories later
    xaxis: {
      categories: [],
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
    grid: {
      show: true,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 10,
        left: 0,
      },
    },
    legend: {
      show: true,
      horizontalAlign: "center",
      offsetX: 0,
      offsetY: 5,
      markers: {
        width: 9,
        height: 9,
        radius: 6,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 0,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "30%",
        barHeight: "70%",
        borderRadius: 5
      },
    },
    // Updated colors to match the new series: Orders, Earnings, Costs
    // Assuming 'warning' (red/orange) is a suitable color for Costs/Expenses.
    colors: [ins('secondary'), ins('chart-primary'), ins('warning')],
    tooltip: {
      shared: true,
      y: [
        // SERIES 1: Orders (Count) - Remains the same
        {
          formatter: function (y) {
            if (typeof y !== "undefined") {
              return y.toFixed(0) + " Orders"; // Changed "Sales" to "Orders" for clarity
            }
            return y;
          },
        },
        // SERIES 2: Earnings (Currency) - Remains the same
        {
          formatter: function (y) {
            if (typeof y !== "undefined") {
              // NOTE: If y is in full dollars, remove the 'k'
              return "$" + y.toFixed(2);
            }
            return y;
          },
        },
        // SERIES 3: Costs (Currency) - ***UPDATED FORMATTER***
        {
          formatter: function (y) {
            if (typeof y !== "undefined") {
              return "Cost: $" + y.toFixed(2); // Formatted as currency
            }
            return y;
          },
        },
      ],
    },
  };

  // 3. Fetch data and initialize chart
  fetch(endpoint)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      // Remove loading state
      if (loadingText) loadingText.remove();

      // Merge static options with dynamic data
      const finalOptions = {
        ...baseOptions,
        series: data.series || [],
        xaxis: {
          ...baseOptions.xaxis,
          categories: data.categories || []
        },
      };

      // 4. Call your Custom Apex Chart wrapper
      new CustomApexChart({
        selector: '#seller-revenue',
        options: () => (finalOptions)
      });
    })
    .catch(error => {
      console.error('Error loading chart data:', error);
      if (loadingText) loadingText.remove();
      chartContainer.innerHTML = '<div class="text-center text-danger p-5">Failed to load chart data.</div>';
    });
});
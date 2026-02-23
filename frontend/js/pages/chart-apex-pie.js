/**
 * Template Name: UBold - Admin & Dashboard Template
 * By (Author): Coderthemes
 * Module/App (File Name): Chart Apex Pie
 */
import { CustomApexChart , ins} from '../app'
import small1 from '@/images/stock/small-1.jpg'
import small2 from '@/images/stock/small-2.jpg'
import small3 from '@/images/stock/small-3.jpg'
import small4 from '@/images/stock/small-4.jpg'

//
 // SIMPLE PIE CHART
 //

 function initPieChart() {
   console.log("SUCCESS: turbo:load event fired!");
   // 1. Find the target element by its new ID
   const chartContainer = document.getElementById('item-costs-data-display');

  // CRITICAL: Check for element existence to avoid 'null' error
  if (!chartContainer) return;

  const endpoint = chartContainer.dataset.chartEndpoint;
  const loadingText = document.getElementById('loading-text');

  if (!endpoint) {
    console.error("Endpoint not found for item production costs chart.");
    if (loadingText) loadingText.remove();
    chartContainer.innerHTML = '<div class="text-center text-danger p-5">Chart data endpoint is missing.</div>';
    return;
  }

  // 2. Define the static base options (from your previous snippet)
  const baseOptions = () => ({
    chart: {
      height: 320,
      type: 'pie',
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      verticalAlign: 'middle',
      floating: false,
      fontSize: '14px',
      offsetX: 0,
      offsetY: 5
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '14px',
        fontWeight: 500
      }
    },
    theme: {
      monochrome: {
        enabled: true,
        color: '#008FFB',
        shadeTo: 'light',
        shadeIntensity: 0.6
      }
    },
    responsive: [{
      breakpoint: 600,
      options: {
        chart: {
          height: 240
        },
        legend: {
          show: false
        },
      }
    }]
  });

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
        ...baseOptions(), // Spread the base options
        series: data.series || [], // Add fetched series
        labels: data.labels || [],  // Add fetched labels
      };

      // 4. Call your Custom Apex Chart wrapper
      new CustomApexChart({
        selector: '#item-costs-data-display', // Target the main container ID
        options: () => (finalOptions)
      });
    })
    .catch(error => {
      console.error('Error loading chart data:', error);
      if (loadingText) loadingText.remove();
      chartContainer.innerHTML = '<div class="text-center text-danger p-5">Failed to load chart data.</div>';
    });
}

// Initialize on both page load and Turbo navigation
document.addEventListener('turbo:load', initPieChart);
document.addEventListener('DOMContentLoaded', initPieChart);

//
// MENU CATEGORIES PIE CHART
//
let menuCategoriesChartInstance = null;

function destroyMenuCategoriesChart() {
  if (menuCategoriesChartInstance && menuCategoriesChartInstance.chart) {
    try {
      menuCategoriesChartInstance.chart.destroy();
    } catch (e) {
      console.warn('Error destroying chart:', e);
    }
  }
  menuCategoriesChartInstance = null;
}

function loadMenuCategoriesChart(selectedItemIds = null) {
  const chartContainer = document.getElementById('menu-categories-pie');
  if (!chartContainer) {
    destroyMenuCategoriesChart();
    return;
  }

  const baseEndpoint = chartContainer.dataset.chartEndpoint;
  const loadingText = document.getElementById('menu-categories-loading');

  if (!baseEndpoint) {
    console.error('No chart endpoint found');
    return;
  }

  let endpoint = baseEndpoint;
  if (selectedItemIds && selectedItemIds.length > 0) {
    const params = new URLSearchParams();
    selectedItemIds.forEach(id => params.append('item_ids[]', id));
    endpoint = `${baseEndpoint}?${params.toString()}`;
  }

  if (loadingText) loadingText.style.display = 'block';

  const baseOptions = () => ({
    chart: {
      height: 320,
      type: 'pie',
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      verticalAlign: 'middle',
      floating: false,
      fontSize: '12px',
      offsetX: 0,
      offsetY: 5
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '12px',
        fontWeight: 500
      }
    },
    colors: ['#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026', '#800026'],
    responsive: [{
      breakpoint: 600,
      options: {
        chart: {
          height: 240
        },
        legend: {
          show: false
        },
      }
    }]
  });

  fetch(endpoint)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      if (loadingText) loadingText.style.display = 'none';

      const hasExistingChart = menuCategoriesChartInstance && 
                               menuCategoriesChartInstance.chart && 
                               typeof menuCategoriesChartInstance.chart.updateOptions === 'function';

      if (hasExistingChart) {
        menuCategoriesChartInstance.chart.updateOptions({
          series: data.series || [],
          labels: data.labels || []
        }, false, true);
      } else {
        destroyMenuCategoriesChart();
        
        const finalOptions = {
          ...baseOptions(),
          series: data.series || [],
          labels: data.labels || [],
        };

        menuCategoriesChartInstance = new CustomApexChart({
          selector: '#menu-categories-pie',
          options: () => (finalOptions)
        });
      }
    })
    .catch(error => {
      console.error('Error loading menu categories chart:', error);
      if (loadingText) loadingText.style.display = 'none';
      const container = document.getElementById('menu-categories-pie');
      if (container) {
        container.innerHTML = '<div class="text-center text-danger p-5">Failed to load chart data.</div>';
      }
    });
}

document.addEventListener('turbo:load', function() {
  const chartContainer = document.getElementById('menu-categories-pie');
  if (!chartContainer) {
    destroyMenuCategoriesChart();
    return;
  }

  loadMenuCategoriesChart();

  const selectAllCheckbox = document.getElementById('categorySelectAll');
  const itemCheckboxes = document.querySelectorAll('.category-item-checkbox');

  if (selectAllCheckbox) {
    selectAllCheckbox.removeEventListener('change', handleCategorySelectAll);
    selectAllCheckbox.addEventListener('change', handleCategorySelectAll);
  }

  itemCheckboxes.forEach(cb => {
    cb.removeEventListener('change', handleCategoryItemChange);
    cb.addEventListener('change', handleCategoryItemChange);
  });
});

function handleCategorySelectAll() {
  const itemCheckboxes = document.querySelectorAll('.category-item-checkbox');
  const selectAllCheckbox = document.getElementById('categorySelectAll');
  itemCheckboxes.forEach(cb => cb.checked = selectAllCheckbox.checked);
  updateCategoryChart();
}

function handleCategoryItemChange() {
  const selectAllCheckbox = document.getElementById('categorySelectAll');
  const itemCheckboxes = document.querySelectorAll('.category-item-checkbox');
  if (selectAllCheckbox) {
    selectAllCheckbox.checked = Array.from(itemCheckboxes).every(c => c.checked);
  }
  updateCategoryChart();
}

function updateCategoryChart() {
  const itemCheckboxes = document.querySelectorAll('.category-item-checkbox');
  const selectedIds = Array.from(itemCheckboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.value);
  loadMenuCategoriesChart(selectedIds);
}

new CustomApexChart({
    selector: '#simple-pie',
    options: () => ({
        chart: {
            height: 320,
            type: 'pie',
        },
        series: [36, 28, 18, 12, 6],
        labels: ['Brand A', 'Brand B', 'Brand C', 'Brand D', 'Brand E'],
        legend: {
            show: true,
            position: 'bottom',
            horizontalAlign: 'center',
            verticalAlign: 'middle',
            floating: false,
            fontSize: '14px',
            offsetX: 0,
            offsetY: 5
        },
        dataLabels: {
            enabled: true,
            style: {
                fontSize: '14px',
                fontWeight: 500
            }
        },
        colors: [ins('primary'), ins('warning'), ins('danger'), ins('info'), ins('secondary')],
        responsive: [{
            breakpoint: 600,
            options: {
                chart: {
                    height: 240
                },
                legend: {
                    show: false
                },
            }
        }]
    })
})


//
// SIMPLE DONUT CHART
//
new CustomApexChart({
    selector: '#simple-donut',
    options: () => ({
        chart: {
            height: 320,
            type: 'donut',
        },
        series: [48, 32, 28, 15, 7],
        legend: {
            show: true,
            position: 'bottom',
            horizontalAlign: 'center',
            verticalAlign: 'middle',
            floating: false,
            fontSize: '14px',
            offsetX: 0,
            offsetY: 5
        },
        labels: ['Organic Search', 'Direct', 'Referral', 'Social Media', 'Email'],
        colors: [ins('secondary'), ins('purple'), ins('info'), ins('gray'), ins('light')],
        dataLabels: {
            enabled: true,
            style: {
                fontSize: '14px',
                fontWeight: 500
            }
        },
        responsive: [{
            breakpoint: 600,
            options: {
                chart: {
                    height: 240
                },
                legend: {
                    show: false
                },
            }
        }]
    })
})


//
// MONOCHROME PIE CHART
//
new CustomApexChart({
    selector: '#monochrome-pie',
    options: () => ({
        chart: {
            height: 320,
            type: 'pie',
        },
        series: [120, 90, 150, 180, 160, 70],
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        legend: {
            show: true,
            position: 'bottom',
            horizontalAlign: 'center',
            verticalAlign: 'middle',
            floating: false,
            fontSize: '14px',
            offsetX: 0,
            offsetY: 5
        },
        dataLabels: {
            enabled: true,
            style: {
                fontSize: '14px',
                fontWeight: 500
            }
        },
        theme: {
            monochrome: {
                enabled: true
            }
        },
        responsive: [{
            breakpoint: 600,
            options: {
                chart: {
                    height: 240
                },
                legend: {
                    show: false
                },
            }
        }]
    })
})


//
// GRADIENT DONUT CHART
//
new CustomApexChart({
    selector: '#gradient-donut',
    options: () => ({
        chart: {
            height: 320,
            type: 'donut',
        },
        series: [38, 26, 18, 12, 6],
        legend: {
            show: true,
            position: 'bottom',
            horizontalAlign: 'center',
            verticalAlign: 'middle',
            floating: false,
            fontSize: '14px',
            offsetX: 0,
            offsetY: 5
        },
        labels: ['Social', 'Productivity', 'Entertainment', 'Education', 'Health'],
        colors: [ins('primary'), ins('orange'), ins('danger'), ins('info'), ins('secondary')],
        dataLabels: {
            enabled: true,
            style: {
                fontSize: '14px',
                fontWeight: 500
            }
        },
        responsive: [{
            breakpoint: 600,
            options: {
                chart: {
                    height: 240
                },
                legend: {
                    show: false
                },
            }
        }],
        fill: {
            type: 'gradient'
        }
    })
})


//
// PATTERNED DONUT CHART
//
new CustomApexChart({
    selector: '#patterned-donut',
    options: () => ({
        chart: {
            height: 320,
            type: 'donut',
            dropShadow: {
                enabled: true,
                color: '#111',
                top: -1,
                left: 3,
                blur: 3,
                opacity: 0.2
            }
        },
        stroke: {
            show: true,
            width: 2,
        },
        series: [38, 27, 18, 12, 5],
        labels: ['Netflix', 'YouTube', 'Amazon Prime', 'Disney+', 'HBO Max'],
        dataLabels: {
            enabled: false
        },
        fill: {
            type: 'pattern',
            opacity: 1,
            pattern: {
                enabled: true,
                style: ['circles', 'slantedLines', 'verticalLines', 'horizontalLines', 'squares'],
            },
        },
        states: {
            hover: {
                enabled: false
            }
        },
        legend: {
            show: true,
            position: 'bottom',
            horizontalAlign: 'center',
            verticalAlign: 'middle',
            floating: false,
            fontSize: '14px',
            offsetX: 0,
            offsetY: 5
        },
        responsive: [{
            breakpoint: 600,
            options: {
                chart: {
                    height: 240
                },
                legend: {
                    show: false
                },
            }
        }]
    })
})


//
// PIE CHART WITH IMAGE FILL
//
new CustomApexChart({
    selector: '#image-pie',
    options: () => ({
        chart: {
            height: 320,
            type: 'pie',
        },
        labels: ['Apple', 'Tesla', 'Amazon', 'Google'],
        series: [30, 44, 60, 39],
        fill: {
            type: 'image',
            opacity: 0.85,
            image: {
                src: [small1, small2, small3, small4],
                width: 25,
                imagedHeight: 25
            },
        },
        stroke: {
            width: 4
        },
        dataLabels: {
            enabled: false
        },
        legend: {
            show: true,
            position: 'bottom',
            horizontalAlign: 'center',
            verticalAlign: 'middle',
            floating: false,
            fontSize: '14px',
            offsetX: 0,
            offsetY: 7
        },
        responsive: [{
            breakpoint: 600,
            options: {
                chart: {
                    height: 240
                },
                legend: {
                    show: false
                },
            }
        }]
    })
})


//
// DONUT UPDATE
//
const getOptions = () => ({
    chart: {
        height: 320,
        type: 'donut',
    },
    dataLabels: {
        enabled: false
    },
    series: [64, 75, 33, 53],
    legend: {
        show: true,
        position: 'bottom',
        horizontalAlign: 'center',
        verticalAlign: 'middle',
        floating: false,
        fontSize: '14px',
        offsetX: 0,
        offsetY: 7
    },
    colors: [ins('purple'), ins('warning'), ins('danger'), ins('info')],
    responsive: [{
        breakpoint: 600,
        options: {
            chart: {
                height: 240
            },
            legend: {
                show: false
            },
        }
    }]
})

const updateChart = new CustomApexChart({
    selector: '#update-donut',
    options: getOptions,
})

function appendData() {
    const arr = updateChart.chart.w.globals.series.map(function () {
        return Math.floor(Math.random() * (100 - 1 + 1)) + 1;
    });
    arr.push(Math.floor(Math.random() * (100 - 1 + 1)) + 1);
    return arr;
}

function removeData() {
    const arr = updateChart.chart.w.globals.series.map(function () {
        return Math.floor(Math.random() * (100 - 1 + 1)) + 1;
    });
    arr.pop();
    return arr;
}

function randomize() {
    return updateChart.chart.w.globals.series.map(function () {
        return Math.floor(Math.random() * (100 - 1 + 1)) + 1;
    });
}

function reset() {
    return getOptions().series;
}

// Wrap in null checks - these elements may not exist on all pages
const randomizeBtn = document.querySelector("#randomize");
if (randomizeBtn) {
    randomizeBtn.addEventListener("click", function () {
        updateChart.chart.updateSeries(randomize());
    });
}

const addBtn = document.querySelector("#add");
if (addBtn) {
    addBtn.addEventListener("click", function () {
        updateChart.chart.updateSeries(appendData());
    });
}

const removeBtn = document.querySelector("#remove");
if (removeBtn) {
    removeBtn.addEventListener("click", function () {
        updateChart.chart.updateSeries(removeData());
    });
}

const resetBtn = document.querySelector("#reset");
if (resetBtn) {
    resetBtn.addEventListener("click", function () {
        updateChart.chart.updateSeries(reset());
    });
}
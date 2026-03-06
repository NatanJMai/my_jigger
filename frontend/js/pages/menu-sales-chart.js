import { CustomChartJs, ins } from '../app'

// ─── Instances ────────────────────────────────────────────────────────────────
let menuSalesChartInstance = null;
let menuCategoriesChartInstance = null;
let forecastDetailChartInstance = null;

// ─── Shared state ─────────────────────────────────────────────────────────────
let _lastSalesData = null;   // { labels, series } cached from last fetch
let _forecastData = null;   // { [itemName]: [30 numbers] }
let _selectedItem = null;
let _viewMode = 'all';  // 'all' | 'top5'

// ─── Colour palette for forecast panel ───────────────────────────────────────
const PALETTE = [
  '#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f',
  '#edc948', '#b07aa1', '#ff9da7', '#9c755f', '#bab0ac',
  '#499894', '#86bcb6'
];

// ─────────────────────────────────────────────────────────────────────────────
// EXISTING: Line / stacked-area sales chart
// ─────────────────────────────────────────────────────────────────────────────
function loadMenuSalesChart(selectedIds = null) {
  const chartContainer = document.getElementById('menu-sales-container');
  if (!chartContainer) return;

  const baseEndpoint = chartContainer.dataset.chartEndpoint;
  if (!baseEndpoint) return;

  let endpoint = baseEndpoint;
  if (selectedIds && selectedIds.length > 0) {
    const params = new URLSearchParams();
    selectedIds.forEach(id => params.append('item_ids[]', id));
    endpoint = `${baseEndpoint}?${params.toString()}`;
  }

  fetch(endpoint)
    .then(response => response.json())
    .then(data => {
      const bodyFont = getComputedStyle(document.body).fontFamily.trim();
      const labels = data.categories || [];
      const ctx = document.getElementById('menu-sales-performance').getContext('2d');

      const datasets = (data.series || []).map((series_data, index) => {
        const colorNames = ['primary', 'secondary', 'dark', 'gray'];
        const colorName = colorNames[index % colorNames.length];
        const color = ins(`chart-${colorName}`);

        const gradient = ctx.createLinearGradient(0, 0, 0, 350);
        const colorRgb = getComputedStyle(document.documentElement)
          .getPropertyValue(`--ins-chart-${colorName}-rgb`).trim();

        if (colorRgb) {
          gradient.addColorStop(0, `rgba(${colorRgb}, 0.4)`);
          gradient.addColorStop(1, `rgba(${colorRgb}, 0)`);
        } else {
          gradient.addColorStop(0, color || '#6658dd');
          gradient.addColorStop(1, 'rgba(102, 88, 221, 0)');
        }

        return {
          type: 'line',
          label: series_data.name,
          data: series_data.data,
          borderColor: color,
          backgroundColor: gradient,
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 5,
          pointBackgroundColor: color,
          fill: true
        };
      });

      // Cache for forecast panel
      _lastSalesData = { labels, series: data.series || [] };

      if (menuSalesChartInstance && menuSalesChartInstance.chart && document.contains(menuSalesChartInstance.element)) {
        menuSalesChartInstance.chart.data.labels = labels;
        menuSalesChartInstance.chart.data.datasets = datasets;
        menuSalesChartInstance.chart.update();
        // Re-apply Top 5 filter if active
        if (_viewMode === 'top5') applyViewModeToChart();
      } else {
        menuSalesChartInstance = new CustomChartJs({
          selector: '#menu-sales-performance',
          options: () => ({
            data: { labels, datasets },
            options: {
              maintainAspectRatio: false,
              interaction: { intersect: false, mode: 'index' },
              plugins: {
                legend: {
                  position: 'top',
                  labels: {
                    font: { family: bodyFont },
                    color: ins('secondary-color'),
                    usePointStyle: true,
                    pointStyle: 'circle'
                  }
                },
                tooltip: {
                  backgroundColor: ins('card-bg'),
                  titleColor: ins('body-color'),
                  bodyColor: ins('secondary-color'),
                  borderColor: ins('border-color'),
                  borderWidth: 1,
                  padding: 10,
                  displayColors: true,
                  callbacks: {
                    label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y} units`,
                    footer: items => {
                      const sum = items.reduce((s, i) => s + i.parsed.y, 0);
                      return `Total: ${sum} units`;
                    }
                  }
                }
              },
              scales: {
                x: { grid: { display: false } },
                y: {
                  stacked: true,
                  beginAtZero: true,
                  grid: { color: ins('border-color'), borderDash: [5, 5] }
                }
              }
            }
          })
        });
      }
    })
    .catch(error => console.error('Error loading menu sales chart:', error));
}

// ─────────────────────────────────────────────────────────────────────────────
// EXISTING: Doughnut categories chart
// ─────────────────────────────────────────────────────────────────────────────
function loadMenuCategoriesChart(selectedIds = null) {
  const chartContainer = document.getElementById('menu-categories-container');
  if (!chartContainer) return;

  const baseEndpoint = chartContainer.dataset.chartEndpoint;
  if (!baseEndpoint) return;

  let endpoint = baseEndpoint;
  if (selectedIds && selectedIds.length > 0) {
    const params = new URLSearchParams();
    selectedIds.forEach(id => params.append('item_ids[]', id));
    endpoint = `${baseEndpoint}?${params.toString()}`;
  }

  fetch(endpoint)
    .then(response => response.json())
    .then(data => {
      const bodyFont = getComputedStyle(document.body).fontFamily.trim();

      if (menuCategoriesChartInstance && menuCategoriesChartInstance.chart && document.contains(menuCategoriesChartInstance.element)) {
        menuCategoriesChartInstance.chart.data.labels = data.labels || [];
        menuCategoriesChartInstance.chart.data.datasets[0].data = data.series || [];
        menuCategoriesChartInstance.chart.update();
      } else {
        menuCategoriesChartInstance = new CustomChartJs({
          selector: '#menu-categories-pie',
          options: () => ({
            type: 'doughnut',
            data: {
              labels: data.labels || [],
              datasets: [{
                data: data.series || [],
                backgroundColor: [
                  ins('chart-primary'), ins('chart-secondary'), ins('chart-dark'),
                  ins('chart-gray'), ins('chart-info'), ins('chart-warning'),
                  ins('chart-danger'), ins('chart-success')
                ],
                borderColor: ins('card-bg'),
                borderWidth: 2,
                cutout: '70%',
                radius: '90%',
                hoverOffset: 10,
                spacing: 5
              }]
            },
            options: {
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    font: { family: bodyFont },
                    color: ins('secondary-color'),
                    usePointStyle: true,
                    pointStyle: 'circle',
                    boxWidth: 8,
                    boxHeight: 8,
                    padding: 15
                  }
                },
                tooltip: {
                  backgroundColor: ins('card-bg'),
                  titleColor: ins('body-color'),
                  bodyColor: ins('secondary-color'),
                  borderColor: ins('border-color'),
                  borderWidth: 1,
                  callbacks: { label: ctx => `${ctx.label}: ${ctx.parsed}` }
                }
              }
            }
          })
        });
      }
    })
    .catch(error => console.error('Error loading categories chart:', error));
}

// ─────────────────────────────────────────────────────────────────────────────
// EXISTING: Checkbox filter wiring
// ─────────────────────────────────────────────────────────────────────────────
function updateSalesChart() {
  const selectedIds = Array.from(document.querySelectorAll('.sales-item-checkbox'))
    .filter(cb => cb.checked).map(cb => cb.value);
  loadMenuSalesChart(selectedIds);
}

function updateCategoryChart() {
  const selectedIds = Array.from(document.querySelectorAll('.category-item-checkbox'))
    .filter(cb => cb.checked).map(cb => cb.value);
  loadMenuCategoriesChart(selectedIds);
}

// ─────────────────────────────────────────────────────────────────────────────
// Top 5 toggle — filters cached series to top 5 by total units, re-renders
// ─────────────────────────────────────────────────────────────────────────────
function applyViewModeToChart() {
  if (!_lastSalesData) return;

  let series = _lastSalesData.series;

  if (_viewMode === 'top5') {
    series = [...series]
      .sort((a, b) => {
        const sumA = a.data.reduce((s, v) => s + (v || 0), 0);
        const sumB = b.data.reduce((s, v) => s + (v || 0), 0);
        return sumB - sumA;
      })
      .slice(0, 5);
  }

  if (!menuSalesChartInstance?.chart) return;

  const ctx = document.getElementById('menu-sales-performance')?.getContext('2d');
  if (!ctx) return;

  const labels = _lastSalesData.labels;
  const bodyFont = getComputedStyle(document.body).fontFamily.trim();

  const datasets = series.map((series_data, index) => {
    const colorNames = ['primary', 'secondary', 'dark', 'gray'];
    const colorName = colorNames[index % colorNames.length];
    const color = ins(`chart-${colorName}`);

    const gradient = ctx.createLinearGradient(0, 0, 0, 350);
    const colorRgb = getComputedStyle(document.documentElement)
      .getPropertyValue(`--ins-chart-${colorName}-rgb`).trim();

    if (colorRgb) {
      gradient.addColorStop(0, `rgba(${colorRgb}, 0.4)`);
      gradient.addColorStop(1, `rgba(${colorRgb}, 0)`);
    } else {
      gradient.addColorStop(0, color || '#6658dd');
      gradient.addColorStop(1, 'rgba(102, 88, 221, 0)');
    }

    return {
      type: 'line',
      label: series_data.name,
      data: series_data.data,
      borderColor: color,
      backgroundColor: gradient,
      borderWidth: 2,
      tension: 0.4,
      pointRadius: 3,
      pointHoverRadius: 5,
      pointBackgroundColor: color,
      fill: true
    };
  });

  menuSalesChartInstance.chart.data.labels = labels;
  menuSalesChartInstance.chart.data.datasets = datasets;
  menuSalesChartInstance.chart.update();
}

// ─────────────────────────────────────────────────────────────────────────────
// NEW: Forecast — mock data generation
// ─────────────────────────────────────────────────────────────────────────────
function generateMockForecast(series) {
  const result = {};
  series.forEach(item => {
    const hist = item.data;
    const avg = hist.length ? hist.reduce((s, v) => s + v, 0) / hist.length : 10;

    result[item.name] = Array.from({ length: 30 }, (_, i) => {
      const d = new Date(2026, 2, i + 1);
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;
      return Math.max(0, Math.round(
        avg * 1.06 * (1 + i * 0.002) +
        Math.sin(i * 0.9 + item.name.length) * (avg * 0.25) +
        (isWeekend ? avg * 0.3 : 0) +
        (Math.random() - 0.5) * (avg * 0.2)
      ));
    });
  });
  return result;
}

function buildForecastInsight(forecasts, series) {
  const ranked = Object.entries(forecasts)
    .map(([name, vals]) => ({ name, total: vals.reduce((s, v) => s + v, 0) }))
    .sort((a, b) => b.total - a.total);

  const top = ranked[0];
  const prevItem = series.find(s => s.name === top.name);
  const prevTotal = prevItem ? prevItem.data.reduce((s, v) => s + v, 0) : 0;
  const pct = prevTotal > 0 ? Math.round(((top.total - prevTotal) / prevTotal) * 100) : 0;

  return `Next 30 days expected to shift <strong>${pct >= 0 ? '+' : ''}${pct}%</strong> vs recent history. ` +
    `<strong>${top.name}</strong> is predicted to lead with ~<strong>${top.total.toLocaleString()}</strong> units.`;
}

// ─────────────────────────────────────────────────────────────────────────────
// NEW: Forecast — per-item detail chart (Chart.js, actual + dashed forecast)
// ─────────────────────────────────────────────────────────────────────────────
function renderForecastDetail(itemName) {
  if (!_lastSalesData || !_forecastData) return;
  _selectedItem = itemName;

  // Update pill active states
  document.querySelectorAll('.forecast-pill').forEach(p => {
    const active = p.dataset.item === itemName;
    p.classList.toggle('btn-primary', active);
    p.classList.toggle('btn-outline-secondary', !active);
  });

  const seriesItem = _lastSalesData.series.find(s => s.name === itemName);
  const histData = seriesItem ? seriesItem.data : [];
  const foreData = _forecastData[itemName] || [];
  const histLabels = _lastSalesData.labels;
  const foreLabels = Array.from({ length: 30 }, (_, i) => `Mar ${String(i + 1).padStart(2, '0')}`);
  const allLabels = [...histLabels, ...foreLabels];

  const colorIdx = _lastSalesData.series.findIndex(s => s.name === itemName);
  const color = PALETTE[colorIdx % PALETTE.length];

  // Pad with nulls so the two lines don't connect across the boundary
  const actualPadded = [...histData, ...Array(foreData.length).fill(null)];
  const forecastPadded = [...Array(histData.length).fill(null), ...foreData];

  const bodyFont = getComputedStyle(document.body).fontFamily.trim();

  const datasets = [
    {
      label: 'Actual',
      data: actualPadded,
      borderColor: color,
      backgroundColor: 'transparent',
      borderWidth: 2,
      tension: 0.4,
      pointRadius: 2,
      spanGaps: false
    },
    {
      label: 'Forecast',
      data: forecastPadded,
      borderColor: color,
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderDash: [6, 4],
      tension: 0.4,
      pointRadius: 2,
      spanGaps: false
    }
  ];

  if (forecastDetailChartInstance && forecastDetailChartInstance.chart) {
    forecastDetailChartInstance.chart.data.labels = allLabels;
    forecastDetailChartInstance.chart.data.datasets = datasets;
    forecastDetailChartInstance.chart.update();
  } else {
    forecastDetailChartInstance = new CustomChartJs({
      selector: '#forecast-detail-canvas',
      options: () => ({
        type: 'line',
        data: { labels: allLabels, datasets },
        options: {
          maintainAspectRatio: false,
          interaction: { intersect: false, mode: 'index' },
          plugins: {
            legend: {
              position: 'top',
              labels: {
                font: { family: bodyFont },
                color: ins('secondary-color'),
                usePointStyle: true,
                pointStyle: 'circle'
              }
            },
            tooltip: {
              backgroundColor: ins('card-bg'),
              titleColor: ins('body-color'),
              bodyColor: ins('secondary-color'),
              borderColor: ins('border-color'),
              borderWidth: 1,
              callbacks: {
                label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y != null ? ctx.parsed.y + ' units' : '—'}`
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { maxTicksLimit: 14, maxRotation: 35, font: { size: 10 } }
            },
            y: {
              beginAtZero: true,
              grid: { color: ins('border-color'), borderDash: [5, 5] },
              title: { display: true, text: 'Units sold' }
            }
          }
        }
      })
    });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// NEW: Forecast — ranked summary bars
// ─────────────────────────────────────────────────────────────────────────────
function renderForecastRanked(forecasts, series) {
  const list = document.getElementById('forecast-ranked-list');
  if (!list) return;

  const ranked = Object.entries(forecasts)
    .map(([name, vals]) => ({ name, total: vals.reduce((s, v) => s + v, 0) }))
    .sort((a, b) => b.total - a.total);

  const max = ranked[0]?.total || 1;

  list.innerHTML = ranked.map(({ name, total }, i) => {
    const pct = Math.round((total / max) * 100);
    const idx = series.findIndex(s => s.name === name);
    const color = PALETTE[idx % PALETTE.length];
    return `
      <div class="d-flex align-items-center gap-3 mb-2 forecast-rank-row"
           style="cursor:pointer;" data-item="${name}">
        <span class="text-muted small fw-semibold" style="width:26px">#${i + 1}</span>
        <span class="small text-truncate" style="flex:0 0 150px" title="${name}">${name}</span>
        <div class="flex-grow-1 rounded" style="height:8px;background:#e9ecef;overflow:hidden;">
          <div style="width:${pct}%;height:100%;background:${color};border-radius:4px;
                      transition:width .8s cubic-bezier(.16,1,.3,1)"></div>
        </div>
        <span class="small fw-semibold text-end" style="flex:0 0 64px">${total.toLocaleString()}</span>
      </div>`;
  }).join('');

  list.querySelectorAll('.forecast-rank-row').forEach(row => {
    row.addEventListener('click', () => renderForecastDetail(row.dataset.item));
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// NEW: Forecast panel — button wiring
// ─────────────────────────────────────────────────────────────────────────────
function initForecastPanel() {
  const btn = document.getElementById('generate-forecast-btn');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    // Derive the forecast POST URL from the sales GET URL on the same button
    const salesEndpoint = btn.dataset.chartEndpoint || '';
    const forecastEndpoint = salesEndpoint.replace('sales_performance_by_menu', 'ai_forecast');

    if (!forecastEndpoint || forecastEndpoint === salesEndpoint) {
      console.error('AI Forecast: could not derive endpoint from', salesEndpoint);
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status"></span>Generating…';

    // Hide any previous error, reset placeholder visibility
    document.getElementById('forecast-error')?.remove();

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || '';

      const response = await fetch(forecastEndpoint, {
        method: 'POST',
        headers: {
          'X-CSRF-Token': csrfToken,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
        // No body needed — the backend re-queries from the DB
      });

      const json = await response.json();

      if (!response.ok || json.error) {
        throw new Error(json.error || `Server error ${response.status}`);
      }

      _forecastData = json;

      // If sales data hasn't been fetched yet, build a minimal series list from
      // the forecast keys so the rest of the UI still works
      if (!_lastSalesData || !_lastSalesData.series.length) {
        const mockLabels = Array.from({ length: 12 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (11 - i) * 7);
          return d.toLocaleDateString('default', { month: 'short', day: '2-digit' });
        });
        _lastSalesData = {
          labels: mockLabels,
          series: Object.keys(_forecastData).map(name => ({ name, data: Array(12).fill(0) }))
        };
      }

    } catch (err) {
      // Show an inline error without crashing the panel
      const placeholder = document.getElementById('forecast-placeholder');
      const errDiv = document.createElement('div');
      errDiv.id = 'forecast-error';
      errDiv.className = 'alert alert-danger mt-2';
      errDiv.innerHTML = `<i class="ti ti-alert-circle me-2"></i>${err.message}`;
      placeholder?.after(errDiv);

      btn.disabled = false;
      btn.innerHTML = '<i class="ti ti-sparkles me-1"></i>Generate Forecast';
      return;
    }

    // ── Render the panel ────────────────────────────────────────────────────

    // Hide the empty-state placeholder
    document.getElementById('forecast-placeholder')?.classList.add('d-none');

    // Show insight banner
    const insightEl = document.getElementById('forecast-insight');
    const insightTxt = document.getElementById('forecast-insight-text');
    if (insightEl && insightTxt) {
      insightTxt.innerHTML = buildForecastInsight(_forecastData, _lastSalesData.series);
      insightEl.classList.remove('d-none');
    }

    // Build item selector pills
    const selector = document.getElementById('forecast-item-selector');
    if (selector) {
      selector.classList.remove('d-none');
      // Only show pills for items that exist in the forecast response
      const forecastItems = _lastSalesData.series.filter(s => _forecastData[s.name]);
      selector.innerHTML = forecastItems.map(s => `
        <button type="button"
                class="btn btn-sm btn-outline-secondary forecast-pill"
                data-item="${s.name}">${s.name}</button>
      `).join('');
      selector.querySelectorAll('.forecast-pill').forEach(pill => {
        pill.addEventListener('click', () => renderForecastDetail(pill.dataset.item));
      });
    }

    // Reveal detail chart + ranked list
    document.getElementById('forecast-detail-container')?.classList.remove('d-none');
    document.getElementById('forecast-ranked-container')?.classList.remove('d-none');

    // Select first forecasted item by default
    const firstItem = _lastSalesData.series.find(s => _forecastData[s.name]);
    if (firstItem) {
      renderForecastDetail(firstItem.name);
      renderForecastRanked(_forecastData, _lastSalesData.series);
    }

    btn.disabled = false;
    btn.innerHTML = '<i class="ti ti-sparkles me-1"></i>Regenerate Forecast';
  });
}


// ─────────────────────────────────────────────────────────────────────────────
// Bootstrap — matches original init pattern exactly
// ─────────────────────────────────────────────────────────────────────────────
function initMenuCharts() {
  setTimeout(() => {
    loadMenuSalesChart();
    loadMenuCategoriesChart();

    // ── All / Top 5 toggle ────────────────────────────────────────────────────
    const btnAll = document.getElementById('salesViewAll');
    const btnTop5 = document.getElementById('salesViewTop5');

    if (btnAll && btnTop5) {
      btnAll.addEventListener('click', () => {
        if (_viewMode === 'all') return;
        _viewMode = 'all';
        btnAll.classList.add('active');
        btnTop5.classList.remove('active');
        applyViewModeToChart();
      });

      btnTop5.addEventListener('click', () => {
        if (_viewMode === 'top5') return;
        _viewMode = 'top5';
        btnTop5.classList.add('active');
        btnAll.classList.remove('active');
        applyViewModeToChart();
      });
    }

    // Sales "Select All" checkbox
    const salesSelectAll = document.getElementById('salesSelectAll');
    if (salesSelectAll) {
      salesSelectAll.onchange = function () {
        document.querySelectorAll('.sales-item-checkbox').forEach(cb => cb.checked = this.checked);
        updateSalesChart();
      };
    }
    document.querySelectorAll('.sales-item-checkbox').forEach(cb => {
      cb.onchange = function () {
        const all = document.querySelectorAll('.sales-item-checkbox');
        if (salesSelectAll) salesSelectAll.checked = Array.from(all).every(c => c.checked);
        updateSalesChart();
      };
    });

    // Category "Select All" checkbox
    const categorySelectAll = document.getElementById('categorySelectAll');
    if (categorySelectAll) {
      categorySelectAll.onchange = function () {
        document.querySelectorAll('.category-item-checkbox').forEach(cb => cb.checked = this.checked);
        updateCategoryChart();
      };
    }
    document.querySelectorAll('.category-item-checkbox').forEach(cb => {
      cb.onchange = function () {
        const all = document.querySelectorAll('.category-item-checkbox');
        if (categorySelectAll) categorySelectAll.checked = Array.from(all).every(c => c.checked);
        updateCategoryChart();
      };
    });

    // Forecast panel
    initForecastPanel();

  }, 100);
}

document.addEventListener('turbo:load', initMenuCharts);

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initMenuCharts();
}

// Fallback: if charts are inside a Bootstrap tab, re-init when the tab becomes visible
document.addEventListener('shown.bs.tab', function (e) {
  if (e.target && (e.target.id === 'tab1-tab' || e.target.getAttribute('data-bs-target') === '#tab1')) {
    menuSalesChartInstance = null;
    menuCategoriesChartInstance = null;
    initMenuCharts();
  }
});
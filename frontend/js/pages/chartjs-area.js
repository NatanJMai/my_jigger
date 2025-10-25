
/**
 * Template Name: UBold - Admin & Dashboard Template
 * By (Author): Coderthemes
 * Module/App (File Name): ChartJs Area
 */
import { CustomChartJs, ins } from '../app'

const bodyFont = getComputedStyle(document.body).fontFamily.trim();

const BasiAreaChart = new CustomChartJs({
    selector: '#basic-area-chart',
    options: () => {
        return {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                datasets: [{
                    label: 'User Signups',
                    data: [120, 150, 180, 210, 190, 230, 250, 270, 300],
                    backgroundColor: ins('chart-primary-rgb', 0.3),
                    borderColor: ins('chart-primary'),
                    fill: true,
                    tension: 0.3,
                    pointRadius: 0,
                    borderWidth: 2
                }]
            },
            options: {
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        enabled: true,
                        mode: 'index',
                        intersect: false
                    }
                }
            }
        };
    }
});


const DiffDatasetAreaChart = new CustomChartJs({
    selector: '#different-dataset-area-chart',
    options: () => ({
        type: 'line',
        data: {
            labels: ['0', '1', '2', '3', '4', '5', '6', '7'],
            datasets: [
                {
                    label: 'Current Month',
                    data: [50, 42, 38, 35, 40, 50, 48, 47],
                    fill: true,
                    borderColor: ins('chart-secondary'),
                    backgroundColor: ins('chart-secondary-rgb', 0.2),
                    tension: 0.4,
                    pointRadius: 0,
                    borderWidth: 1
                },
                {
                    label: 'Past Month',
                    data: [60, 55, 50, 45, 50, 58, 55, 53],
                    fill: true,
                    borderColor: ins('chart-gray'),
                    backgroundColor: ins('chart-gray-rgb', 0.2),
                    tension: 0.4,
                    pointRadius: 0,
                    borderWidth: 1
                }
            ]
        },
        options: {
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: { family: bodyFont },
                        color: ins('secondary-color'),
                        usePointStyle: true,      // Show circles instead of default box
                        pointStyle: 'circle',     // Circle shape
                        boxWidth: 8,             // Circle size
                        boxHeight: 8,            // (optional) same as width by default
                        padding: 15,              // Space between legend items
                    }
                },
                tooltip: {
                    enabled: true,
                    titleFont: { family: bodyFont },
                    bodyFont: { family: bodyFont }
                }
            }
        }
    })
});

function randomSmoothData(length, min = 30, max = 100) {
    return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

const StackedChart = new CustomChartJs({
    selector: '#stacked-area-chart',
    options: () => ({
        type: 'line',
        data: {
            labels: ['0', '1', '2', '3', '4', '5', '6', '7'],
            datasets: [
                // Wave A - Primary High
                {
                    label: 'Wave A1',
                    data: randomSmoothData(9, 60, 90),
                    fill: true,
                    borderColor: ins('chart-gray'),
                    backgroundColor: ins('chart-gray-rgb', 0.2),
                    tension: 0.5,
                    pointRadius: 0,
                    borderWidth: 2
                },
                // Wave A - Primary Low
                {
                    label: 'Wave A2',
                    data: randomSmoothData(9, 40, 65),
                    fill: true,
                    borderColor: ins('chart-secondary'),
                    backgroundColor: ins('chart-secondary-rgb', 0.1),
                    tension: 0.5,
                    pointRadius: 0,
                    borderWidth: 1
                },
                // Wave B - Secondary High
                {
                    label: 'Wave B1',
                    data: randomSmoothData(9, 30, 55),
                    fill: true,
                    borderColor: ins('chart-primary'),
                    backgroundColor: ins('chart-primary-rgb', 0.2),
                    tension: 0.5,
                    pointRadius: 0,
                    borderWidth: 2
                },
                // Wave B - Secondary Low
                {
                    label: 'Wave B2',
                    data: randomSmoothData(9, 15, 35),
                    fill: true,
                    borderColor: ins('chart-dark'),
                    backgroundColor: ins('chart-dark-rgb', 0.1),
                    tension: 0.5,
                    pointRadius: 0,
                    borderWidth: 1
                }
            ]

        },
        options: {
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
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
                    enabled: true,
                    titleFont: { family: bodyFont },
                    bodyFont: { family: bodyFont }
                }
            }
        }
    })
});


const BoundariesChart = new CustomChartJs({
    selector: '#boundaries-area-chart',
    options: () => ({
        type: 'line', data: {
            labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June'],
            datasets: [{
                label: 'Fully Rounded',
                data: [12.5, -19.4, 14.3, -15.0, 10.8, -10.5],
                borderColor: ins('chart-primary'),
                fill: false
            },]
        }, options: {
            responsive: true, maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: false
                },

            }
        },
    })
});

const DrawTimeAreaChart = new CustomChartJs({
    selector: '#draw-time-chart',
    options: () => ({
        type: 'line', data: {
            labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June'], datasets: [{
                label: 'Fully Rounded',
                data: [10, 20, 15, 35, 38, 24],
                borderColor: ins('chart-gray'),
                backgroundColor: ins('chart-gray-rgb', 0.3),
                fill: true,
                borderWidth: 2,

            }, {
                label: 'Small Radius',
                data: [24, 38, 35, 15, 20, 10],
                borderColor: ins('chart-dark'),
                backgroundColor: ins('chart-dark-rgb', 0.3),
                borderWidth: 2,
                tension: 0.2
            }]
        }, options: {
            responsive: true, maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: false
                },

            }
        },
    })
});
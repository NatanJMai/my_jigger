/**
 * Template Name: UBold - Admin & Dashboard Template
 * By (Author): Coderthemes
 * Module/App (File Name): ChartJs Other
 */
import { CustomChartJs , ins} from '../app'

const bodyFont = getComputedStyle(document.body).fontFamily.trim();

const BubbleChart = new CustomChartJs({
    selector: '#bubble-chart',
    options: () => {
        return {
            type: 'bubble',
            data: {
                labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June'],
                datasets: [
                    {
                        label: 'Data One',
                        data: [
                            { x: 10, y: 20, r: 5 },
                            { x: 20, y: 10, r: 5 },
                            { x: 15, y: 15, r: 5 },
                            { x: 25, y: 12, r: 6 },
                            { x: 18, y: 25, r: 7 },
                            { x: 30, y: 8, r: 4 },
                            { x: 22, y: 18, r: 6 },
                            { x: 35, y: 20, r: 5 },
                            { x: 28, y: 30, r: 7 },
                            { x: 12, y: 26, r: 6 },
                            { x: 40, y: 10, r: 5 }
                        ],
                        borderColor: ins('chart-primary'),
                        backgroundColor: ins('chart-primary-rgb', 0.2),
                        borderWidth: 2,
                        borderSkipped: false
                    },
                    {
                        label: 'Data Two',
                        data: [
                            { x: 12, y: 22 },
                            { x: 22, y: 20 },
                            { x: 5, y: 15 },
                            { x: 16, y: 18 },
                            { x: 9, y: 24 },
                            { x: 28, y: 14 },
                            { x: 19, y: 17 },
                            { x: 33, y: 21 },
                            { x: 14, y: 28 },
                            { x: 8, y: 19 },
                            { x: 36, y: 16 }
                        ],
                        borderColor: ins('chart-gray'),
                        backgroundColor: ins('chart-gray-rgb', 0.2),
                        borderWidth: 2,
                        borderSkipped: false
                    }
                ]
            }

        };
    }
});


function generateRandomData(length, min = -20, max = 80) {
    return Array.from({ length }, () =>
        Math.floor(Math.random() * (max - min + 1)) + min
    );
}

const InterpolationChart = new CustomChartJs({
    selector: '#combo-bar-line-chart',
    options: () => {
        return {
            type: 'bar',
            data: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August'],
                datasets: [
                    {
                        type: 'line',
                        label: 'Line Dataset',
                        data: generateRandomData(8, 20, 90),
                        borderColor: ins('chart-primary'),
                        backgroundColor: ins('chart-primary-rgb', 0.2),
                        tension: 0.4,
                        fill: false,
                        yAxisID: 'y'
                    },
                    {
                        type: 'bar',
                        label: 'Bar Dataset',
                        data: generateRandomData(8, -20, 80),
                        borderColor: ins('chart-gray'),
                        backgroundColor: ins('chart-gray'),
                        yAxisID: 'y',
                        barThickness: 12 // 👈 slim bars
                    }
                ]
            }
        };
    }
});



const StackedBarLineChart = new CustomChartJs({
    selector: '#stacked-bar-line-chart',
    options: () => ({
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            datasets: [
                {
                    type: 'bar',
                    label: 'Bar Dataset 1',
                    data: [30, 20, 50, 40, 60, 70],
                    borderColor: ins('chart-dark'),
                    backgroundColor: ins('chart-dark'),
                    stack: 'Stack 0',
                    barThickness: 20
                },
                {
                    type: 'bar',
                    label: 'Bar Dataset 2',
                    data: [20, 15, 30, 25, 35, 40],
                    borderColor: ins('chart-primary'),
                    backgroundColor: ins('chart-primary'),
                    stack: 'Stack 0',
                    barThickness: 20
                },
                {
                    type: 'line',
                    label: 'Line Dataset',
                    data: [60, 55, 90, 75, 95, 110],
                    borderColor: ins('chart-gray'),
                    backgroundColor: ins('chart-gray-rgb', 0.2),
                    tension: 0.4,
                    fill: false,
                    yAxisID: 'y',
                }
            ]
        }
    })
});

const DoughnutChart = new CustomChartJs({
    selector: '#doughnut-chart',
    options: () => ({
        type: 'doughnut',
        data: {
            labels: ['Organic Search', 'Social Media', 'Referral', 'Email Campaign'],
            datasets: [
                {
                    data: [420, 210, 150, 90],
                    backgroundColor: [
                        ins('chart-primary'),
                        ins('chart-secondary'),
                        ins('chart-dark'),
                        ins('chart-gray')
                    ],
                    borderColor: 'transparent',
                    borderWidth: 3
                }
            ]
        },
        options: {
            cutout: '65%', 
            plugins: {
                legend: { display: false },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: function (ctx) {
                            return `${ctx.label}: ${ctx.parsed}`;
                        }
                    }
                }
            },
            scales: {
                x: { display: false, grid: { display: false }, ticks: { display: false } },
                y: { display: false, grid: { display: false }, ticks: { display: false } }
            }
        }
    })
});


const PieChart = new CustomChartJs({
    selector: '#pie-chart',
    options: () => ({
        type: 'pie',
        data: {
            labels: ['Organic Search', 'Social Media', 'Referral', 'Email Campaign'],
            datasets: [
                {
                    data: [420, 210, 150, 90],
                    backgroundColor: [
                        ins('chart-dark'),
                        ins('chart-primary'),
                        ins('chart-secondary'),
                        ins('chart-gray')
                    ],
                    borderColor: 'transparent',
                    borderWidth: 3
                }
            ]
        },
        options: {
            plugins: {
                legend: { display: false },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: function (ctx) {
                            return `${ctx.label}: ${ctx.parsed}`;
                        }
                    }
                }
            },
            scales: {
                x: { display: false, grid: { display: false }, ticks: { display: false } },
                y: { display: false, grid: { display: false }, ticks: { display: false } }
            }
        }
    })
});


const MultiPieChart = new CustomChartJs({
    selector: '#multi-pie-chart',
    options: () => ({
        type: 'doughnut', // Doughnut is required for multi-ring effect
        data: {
            labels: ['Organic Search', 'Social Media', 'Referral', 'Email Campaign'],
            datasets: [
                {
                    label: '2024',
                    data: [300, 150, 100, 80],
                    backgroundColor: [
                        ins('chart-primary'),
                        ins('chart-secondary'),
                        ins('chart-dark'),
                        ins('chart-gray')
                    ],
                    borderColor: 'transparent',
                    borderWidth: 3
                },
                {
                    label: '2023',
                    data: [250, 120, 90, 60],
                    backgroundColor: [
                        ins('chart-primary-rgb', 0.3),
                        ins('chart-secondary-rgb', 0.3),
                        ins('chart-dark-rgb', 0.3),
                        ins('chart-gray-rgb', 0.3)
                    ],
                    borderColor: 'transparent',
                    borderWidth: 3
                }
            ]
        },
        options: {
            cutout: '30%', // Inner radius
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
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
                    callbacks: {
                        label: function (ctx) {
                            return `${ctx.dataset.label} - ${ctx.label}: ${ctx.parsed}`;
                        }
                    }
                }
            },
            scales: {
                x: { display: false },
                y: { display: false }
            }
        }
    })
});

const PolarChart = new CustomChartJs({
    selector: '#polar-chart',
    options: () => ({
        type: 'polarArea',
        data: {
            labels: ['Jan', 'Feb', 'March', 'April', 'May'],
            datasets: [
                {
                    label: 'Dataset 1',
                    data: [12, 19, 14, 15, 20],
                    backgroundColor: [
                        ins('chart-primary'),
                        ins('chart-secondary'),
                        ins('chart-dark'),
                        ins('chart-gray'),
                        ins('chart-primary-rgb', 0.5) // Add one more color for the fifth item
                    ],
                    borderColor: [
                        ins('chart-primary'),
                        ins('chart-secondary'),
                        ins('chart-dark'),
                        ins('chart-gray'),
                        ins('chart-primary-rgb', 0.1) // Match border color
                    ],
                    borderWidth: 2
                }
            ]
        },
        options: {
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
                    callbacks: {
                        label: function (ctx) {
                            return `${ctx.dataset.label} - ${ctx.label}: ${ctx.parsed}`;
                        }
                    }
                }
            },
            scales: {
                x: { display: false },
                y: { display: false },
                r: {
                    angleLines: {
                        color: ins('border-color') // radial lines color
                    },
                    grid: {
                        color: ins('border-color') // circular grid line color
                    },
                    pointLabels: {
                        color: ins('secondary-color'),
                    },
                    ticks: {
                        font: { family: bodyFont },
                        color: ins('secondary-color'),
                        backdropColor: 'transparent'
                    }
                }
            }
        }
    })
});


const RadarChart = new CustomChartJs({
    selector: '#radar-chart',
    options: () => ({
        type: 'radar', data: {
            labels: ['Jan', 'Feb', 'March', 'April', "May", "June"], datasets: [{
                label: 'Dataset 1',
                data: [12, 29, 39, 22, 28, 34],
                borderColor: ins('chart-primary'),
                backgroundColor: ins('chart-primary-rgb', 0.2),

            }, {
                label: 'Dataset 2',
                data: [10, 19, 15, 28, 34, 39],
                borderColor: ins('chart-dark'),
                backgroundColor: ins('chart-dark-rgb', 0.2),

            },]
        },
        options: {
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
                    callbacks: {
                        label: function (ctx) {
                            return `${ctx.dataset.label} - ${ctx.label}: ${ctx.parsed}`;
                        }
                    }
                }
            },
            scales: {
                x: { display: false },
                y: { display: false },
                r: {
                    angleLines: {
                        color: ins('border-color') // radial lines color
                    },
                    grid: {
                        color: ins('border-color') // circular grid line color
                    },
                    pointLabels: {
                        color: ins('secondary-color'),
                        font: { 
                            family: bodyFont,
                            size: 14
                        },
                    },
                    ticks: {
                        font: { family: bodyFont },
                        color: ins('secondary-color'),
                        backdropColor: 'transparent'
                    }
                }
            }
        }
    })
});


const ScatterChart = new CustomChartJs({
    selector: '#scatter-chart',
    options: () => ({
        type: 'scatter',
        data: {
            labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'Dataset 1',
                    data: [
                        { x: 10, y: 50 },
                        { x: 50, y: 10 },
                        { x: 15, y: 15 },
                        { x: 20, y: 45 },
                        { x: 25, y: 18 },
                        { x: 34, y: 38 },
                        { x: 42, y: 30 },
                        { x: 28, y: 20 },
                        { x: 55, y: 15 }
                    ],
                    borderColor: ins('chart-dark'),
                    backgroundColor: ins('chart-dark-rgb', 0.2),
                    pointRadius: 8, // 👈 bigger dots
                    pointHoverRadius: 10
                },
                {
                    label: 'Dataset 2',
                    data: [
                        { x: 15, y: 45 },
                        { x: 40, y: 20 },
                        { x: 30, y: 5 },
                        { x: 35, y: 25 },
                        { x: 18, y: 25 },
                        { x: 40, y: 8 },
                        { x: 22, y: 32 },
                        { x: 48, y: 16 },
                        { x: 38, y: 22 }
                    ],
                    borderColor: ins('chart-gray'),
                    backgroundColor: ins('chart-gray-rgb', 0.2),
                    pointRadius: 8,
                    pointHoverRadius: 10
                }
            ]
        }
    })
});

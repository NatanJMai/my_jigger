/**
 * Template Name: UBold - Admin & Dashboard Template
 * By (Author): Coderthemes
 * Module/App (File Name): Dashboard
 */
import { CustomChartJs, ins } from "../app";

const bodyFont = getComputedStyle(document.body).fontFamily.trim();

const MultiPieChart = new CustomChartJs({
    selector: '#multi-pie-chart',
    options: () => ({
        type: 'doughnut', // Doughnut is required for multi-ring effect
        data: {
            labels: ['Online Store', 'Retail Stores', 'B2B Revenue', 'Marketplace Revenue'],
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
                    borderWidth: 1,
                    weight: 1, // Outer ring
                    cutout: '30%',
                    radius: '90%'
                },
                {
                    label: '2023',
                    data: [270, 135, 90, 72],
                    backgroundColor: [
                        ins('chart-primary-rgb', 0.3),
                        ins('chart-secondary-rgb', 0.3),
                        ins('chart-dark-rgb', 0.3),
                        ins('chart-gray-rgb', 0.3)
                    ],
                    borderColor: 'transparent',
                    borderWidth: 3,
                    weight: 0.8, // Inner ring
                    cutout: '30%',
                    radius: '60%' // smaller to create spacing
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


//
// Sales Analytics Chart
//
const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

// Generate random data
const generateRandomData = (min, max) =>
    Array.from({ length: 12 }, () =>
        Math.floor(Math.random() * (max - min + 1)) + min
    );

const onlineSales = generateRandomData(1000, 1250);
const inStoreSales = generateRandomData(800, 1250);

// Make total sales independent (i.e. float higher, not sum)
const totalSales = generateRandomData(2500, 3500);

const StackedBarLineChart = new CustomChartJs({
    selector: '#sales-analytics-chart',
    options: () => ({
        data: {
            labels: months,
            datasets: [
                {
                    type: 'bar',
                    label: 'Online Sales',
                    data: onlineSales,
                    borderColor: ins('chart-primary'),
                    backgroundColor: ins('chart-primary'),
                    stack: 'sales',
                    barThickness: 20,
                    borderRadius: 6
                },
                {
                    type: 'bar',
                    label: 'In-store Sales',
                    data: inStoreSales,
                    borderColor: ins('chart-gray'),
                    backgroundColor: ins('chart-gray'),
                    stack: 'sales',
                    barThickness: 20,
                    borderRadius: 6
                },
                {
                    type: 'line',
                    label: 'Projected Sales',
                    data: totalSales,
                    borderColor: ins('chart-dark'),
                    backgroundColor: ins('chart-dark-rgb', 0.2),
                    borderWidth: 2,
                    borderDash: [5, 5], // dashed line
                    tension: 0.4,
                    fill: false,
                    yAxisID: 'y',
                }
            ]
        }
    })
});





/**
 * Template Name: UBold - Admin & Dashboard Template
 * By (Author): Coderthemes
 * Module/App (File Name): ChartJs Line
 */
import { CustomChartJs , ins} from '../app'

const bodyFont = getComputedStyle(document.body).fontFamily.trim();

const BasicLineChart = new CustomChartJs({
    selector: '#basic-line-chart',
    options: () => {
        return {
            type: 'line', data: {
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], datasets: [{
                    label: 'Fully Rounded',
                    data: [32, 42, 42, 62, 52, 75, 62],
                    borderColor: ins('chart-gray'),
                    backgroundColor: ins('chart-gray-rgb', 0.2),
                    fill: true,
                    borderWidth: 2

                }, {
                    label: 'Small Radius',
                    data: [42, 58, 66, 93, 82, 105, 92],
                    fill: true,
                    borderColor: ins('chart-primary'),
                    backgroundColor: ins('chart-gray-rgb', 0.2),
                    borderDash: [5, 5],
                    tension: 0.4,
                    borderWidth: 3
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


const InterpolationChart = new CustomChartJs({
    selector: '#interpolation-chart',
    options: () => {
        return {
            type: 'line',
            data: {
                labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                datasets: [
                    {
                        label: 'Revenue Growth',
                        data: [0, 10, 25, 40, 55, 70, NaN, 90, 80, 100, 85, 95, 110],
                        borderColor: ins('chart-primary'),
                        backgroundColor: ins('chart-primary-rgb', 0.2),
                        fill: false,
                        tension: 0.4
                    },
                    {
                        label: 'User Engagement',
                        data: [5, 15, 30, 45, 50, 65, NaN, 75, 70, 95, 90, 85, 100],
                        borderColor: ins('chart-dark'),
                        backgroundColor: ins('chart-dark-rgb', 0.2),
                        fill: false,
                        tension: 0.4
                    },
                    {
                        label: 'Conversion Rate',
                        data: [2, 8, 20, 30, 40, 55, NaN, 60, 55, 75, 70, 65, 80],
                        borderColor: ins('chart-gray'),
                        backgroundColor: ins('chart-gray-rgb', 0.2),
                        fill: false,
                        tension: 0.4
                    }
                ]
            },
            options: {
                interaction: {
                    mode: 'index',
                    intersect: false
                }
            }
        };
    }
});



const MultiAxisChart = new CustomChartJs({
    selector: '#multi-axes-chart',
    options: () => ({
        type: 'line', data: {
            labels: ['Jan', 'Feb', 'March', 'April', "May", "June", "July"], datasets: [{
                label: 'Date One',
                data: [12, -19, 14, -15, 18, -14, -7],
                borderColor: ins('chart-dark'),
                backgroundColor: ins('chart-dark-rgb', 0.2),
                borderWidth: 1.5,
                yAxisID: 'y',
                tension: 0.4

            }, {
                label: 'Data Two',
                data: [-10, 19, -15, -8, -17, 12, 8],
                backgroundColor: ins('chart-gray-rgb', 0.2),
                borderColor: ins('chart-gray'),
                borderWidth: 1.5,
                yAxisID: 'y1',
                tension: 0.4
            }]
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
                },
            },
            scales: {
                x: {
                    ticks: {
                        font: { family: bodyFont },
                        color: ins('secondary-color'),
                        display: true,
                        drawTicks: true
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    border: {
                        display: false // Hides bottom X axis line
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    grid: {
                        display: true,              // Keeps horizontal lines
                        drawBorder: false,          // Hides Y axis border line
                        color: ins('chart-border-color'),
                        lineWidth: 1
                    },
                    border: {
                        display: false,             // Hides Y axis line (left)
                        dash: [5, 5]
                    },
                    ticks: {
                        font: { family: bodyFont },
                        color: ins('secondary-color')
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: {
                        drawOnChartArea: false, // only want the grid lines for one axis to show up
                    },
                    ticks: {
                        font: { family: bodyFont },
                        color: ins('secondary-color')
                    }
                },
            }
        }
    })
});

const PointChart = new CustomChartJs({
    selector: '#point-styling-chart',
    options: () => ({
        type: 'line',
        data: {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6'],
            datasets: [
                {
                    label: 'Dataset 1',
                    data: [12, -19, 14, -15, 14, -8],
                    borderColor: ins('chart-primary'),
                    backgroundColor: ins('chart-primary-rgb', 0.2),
                    pointStyle: 'circle',
                    pointRadius: 10,
                    pointHoverRadius: 15
                },
                {
                    label: 'Dataset 2',
                    data: [-10, 15, -12, 18, -8, 10],
                    borderColor: ins('chart-gray'),
                    backgroundColor: ins('chart-gray-rgb', 0.2),
                    pointStyle: 'rectRounded',
                    pointRadius: 8,
                    pointHoverRadius: 12
                },
                {
                    label: 'Dataset 3',
                    data: [5, -5, 10, -10, 7, -3],
                    borderColor: ins('chart-dark'),
                    backgroundColor: ins('chart-dark-rgb', 0.2),
                    pointStyle: 'triangle',
                    pointRadius: 9,
                    pointHoverRadius: 13
                }
            ]
        }
    })
});


const skipped = (ctx, value) => ctx.p0.skip || ctx.p1.skip ? value : undefined;
const down = (ctx, value) => ctx.p0.parsed.y > ctx.p1.parsed.y ? value : undefined;
const LineSegmentChart = new CustomChartJs({
    selector: '#line-segment-chart',
    options: () => ({
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'Dataset 1',
                    data: [65, 59, NaN, 48, 56, 57, 40],
                    borderColor: ins('chart-dark'),
                    backgroundColor: ins('chart-dark-rgb', 0.2),
                    spanGaps: true,
                    segment: {
                        borderColor: (ctx) =>
                            skipped(ctx, ins('chart-dark-rgb', 0.2)) ||
                            down(ctx, ins('danger')),
                        borderDash: (ctx) =>
                            skipped(ctx, [3, 6])
                    }
                }
            ]
        }
    })
});

const SteppedLineChart = new CustomChartJs({
    selector: '#stepped-line-chart',
    options: () => ({
        type: 'line', data: {
                labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6'], 
                datasets: [{
                    label: 'Dataset 1', 
                    data: [12, -19, 14, -15, 14, -8], 
                    borderColor: ins('chart-primary'),  
                    backgroundColor: ins('chart-primary-rgb', 0.2),
                    fill: false,
                    stepped: true,
                }]
            }
    })
});
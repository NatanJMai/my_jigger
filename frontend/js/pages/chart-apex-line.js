/**
 * Template Name: UBold - Admin & Dashboard Template
 * By (Author): Coderthemes
 * Module/App (File Name): Chart Apex Line
 */
import { CustomApexChart, ins } from '../app'

function generateDayWiseTimeSeries(baseval, count, yrange) {
    let i = 0;
    const series = [];
    while (i < count) {
        const x = baseval;
        const y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

        series.push([x, y]);
        baseval += 86400000;
        i++;
    }
    return series;
}


//
// Simple line chart
//
function initLineChart() {
    const chartContainer = document.getElementById('line-chart');
    if (!chartContainer) return;

    const endpoint = chartContainer.dataset.chartEndpoint;
    const loadingText = document.getElementById('line-chart-loading');

    if (!endpoint) {
        if (loadingText) loadingText.remove();
        chartContainer.innerHTML = '<div class="text-center text-danger p-5">Chart data endpoint is missing.</div>';
        return;
    }

    // Base options for a simple line chart
    const baseOptions = {
        chart: {
            height: 350,
            type: 'line',
            toolbar: {
                show: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: 3
        },
        xaxis: {
            type: 'category', // or 'datetime' if your data is ISO format
            categories: [] // Dynamic categories will go here
        },
        tooltip: {
            x: {
                format: 'dd MMM'
            }
        }
    };

    fetch(endpoint)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (loadingText) loadingText.remove();

            // The controller sends data structured correctly for ApexCharts
            const finalOptions = {
                ...baseOptions,
                series: data.series || [],
                xaxis: {
                    ...baseOptions.xaxis,
                    categories: data.categories || []
                }
            };

            // Initialize the chart
            new CustomApexChart({
                selector: '#line-chart',
                options: () => (finalOptions)
            });
        })
        .catch(error => {
            console.error('Error loading simple line chart data:', error);
            if (loadingText) loadingText.remove();
            chartContainer.innerHTML = `<div class="text-center text-danger p-5">Failed to load line chart: ${error.message}</div>`;
        });
}

// Initialize on both page load and Turbo navigation
document.addEventListener('turbo:load', initLineChart);

// Removed duplicate Menu Sales chart

//
// Line chart with data labels
//
new CustomApexChart({
    selector: '#line-chart-datalabel',
    options: () => ({
        chart: {
            height: 380,
            type: 'line',
            zoom: { enabled: false },
            toolbar: { show: false },
        },
        colors: [ins('info'), ins('danger')],
        dataLabels: {
            enabled: true,
            style: {
                fontSize: '10px',
                fontWeight: 'bold',
                colors: [ins('info'), ins('danger')]
            },
            background: {
                enabled: true,
                padding: 8,
                borderRadius: 4,
            },
            offsetY: 3
        },
        stroke: {
            width: [2, 2],
            curve: 'smooth'
        },
        series: [
            {
                name: "Revenue - 2024",
                data: [45, 52, 48, 58, 63, 72, 80]
            },
            {
                name: "Expenses - 2024",
                data: [25, 35, 32, 40, 38, 36, 34]
            }
        ],
        grid: {
            row: {
                colors: ['transparent', 'transparent'],
                opacity: 0.2
            },
            borderColor: [ins('border-color')],
            padding: {
                top: 0,
                right: 20,
                bottom: 0,
                left: 20
            }
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        },
        yaxis: {
            title: {
                text: 'Amount (in K)',
                offsetX: 0,
                style: {
                    fontSize: '14px',
                    fontWeight: 500,
                },
            },
            labels: {
                offsetX: -7
            }
        },
        legend: {
            position: 'top',
            horizontalAlign: 'center',
            offsetY: 5,
        },
        responsive: [{
            breakpoint: 600,
            options: {
                chart: {
                    toolbar: {
                        show: false
                    }
                },
                legend: {
                    show: false
                },
            }
        }]
    })
})


//
// Zoomable Timeseries
//
const userGrowthData = [
    [new Date('2024-02-01').getTime(), 4200000],
    [new Date('2024-02-02').getTime(), 4300000],
    [new Date('2024-02-03').getTime(), 4120000],
    [new Date('2024-02-04').getTime(), 4400000],
    [new Date('2024-02-05').getTime(), 4500000],
    [new Date('2024-02-06').getTime(), 4600000],
    [new Date('2024-02-07').getTime(), 4380000],
    [new Date('2024-02-08').getTime(), 4450000],
    [new Date('2024-02-09').getTime(), 4700000],
    [new Date('2024-02-10').getTime(), 4650000],
    [new Date('2024-02-11').getTime(), 4850000],
    [new Date('2024-02-12').getTime(), 4700000],
    [new Date('2024-02-13').getTime(), 4880000],
    [new Date('2024-02-14').getTime(), 4950000],
    [new Date('2024-02-15').getTime(), 5100000],
    [new Date('2024-02-16').getTime(), 5050000],
    [new Date('2024-02-17').getTime(), 4980000],
    [new Date('2024-02-18').getTime(), 5200000],
    [new Date('2024-02-19').getTime(), 5300000],
    [new Date('2024-02-20').getTime(), 5180000],
    [new Date('2024-02-21').getTime(), 5500000],
    [new Date('2024-02-22').getTime(), 5400000],
    [new Date('2024-02-23').getTime(), 5520000],
    [new Date('2024-02-24').getTime(), 5650000],
    [new Date('2024-02-25').getTime(), 5800000],
];

new CustomApexChart({
    selector: '#line-chart-zoomable',
    options: () => ({
        chart: {
            type: 'area',
            stacked: false,
            height: 380,
            zoom: {
                enabled: true
            },
            toolbar: { show: true },
        },
        plotOptions: {
            line: {
                curve: 'straight',
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            width: [3]
        },
        series: [{
            name: 'User Growth',
            data: userGrowthData
        }],
        markers: {
            size: 0,
            style: 'full',
        },
        colors: [ins('danger')],
        grid: {
            row: {
                colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.2
            },
            borderColor: [ins('border-color')],
            padding: {
                right: 20
            }
        },
        fill: {
            gradient: {
                enabled: true,
                shadeIntensity: 1,
                inverseColors: false,
                opacityFrom: 0.5,
                opacityTo: 0.1,
                stops: [0, 70, 80, 100]
            },
        },
        yaxis: {
            min: 1000000,
            max: 6000000,
            labels: {
                formatter: function (val) {
                    return (val / 1000).toFixed(0) + 'K';
                },
            },
            title: {
                text: 'Users',
                offsetX: -5,
                style: {
                    fontSize: '14px',
                    fontWeight: 500,
                },
            },
        },
        xaxis: {
            type: 'datetime',
        },
        tooltip: {
            shared: false,
            y: {
                formatter: function (val) {
                    return (val / 1000).toFixed(0) + 'K';
                }
            }
        },
        responsive: [{
            breakpoint: 600,
            options: {
                chart: {
                    toolbar: {
                        show: false
                    }
                },
                legend: {
                    show: false
                },
            }
        }]
    })
})


//
// Line Annotations 
//
new CustomApexChart({
    selector: '#line-chart-annotations',
    options: () => ({
        annotations: {
            yaxis: [{
                y: 4200,
                borderColor: ins('primary'),
                label: {
                    borderColor: ins('primary'),
                    style: {
                        color: '#ffffff',
                        background: ins('primary'),
                        fontWeight: 'bold'
                    },
                    text: 'Support Level',
                }
            }],
            xaxis: [
                {
                    x: new Date('2024-09-07').getTime(),
                    borderColor: ins('purple'),
                    label: {
                        borderColor: ins('purple'),
                        style: {
                            color: '#ffffff',
                            background: ins('purple'),
                            fontWeight: 'bold'
                        },
                        text: 'Launch Event',
                    }
                },
                {
                    x: new Date('2024-10-01').getTime(),
                    borderColor: ins('warning'),
                    label: {
                        borderColor: ins('warning'),
                        style: {
                            color: '#ffffff',
                            background: ins('warning'),
                            fontWeight: 'bold'
                        },
                        orientation: 'horizontal',
                        text: 'Campaign Start',
                    }
                }
            ],
            points: [{
                x: new Date('2024-09-20').getTime(),
                y: 4800,
                marker: {
                    size: 8,
                    fillColor: '#ffffff',
                    strokeColor: ins('danger'),
                    radius: 2
                },
                label: {
                    borderColor: ins('danger'),
                    offsetY: 0,
                    style: {
                        color: '#ffffff',
                        background: ins('danger'),
                        fontWeight: 'bold'
                    },
                    text: 'Peak Point',
                }
            }]
        },
        chart: {
            height: 380,
            type: 'line',
            id: 'custom-line-chart',
            toolbar: { show: false },
        },
        colors: [ins('secondary')],
        dataLabels: {
            enabled: false
        },
        stroke: {
            width: 3,
            curve: 'smooth'
        },
        series: [{
            name: 'Visitors',
            data: [
                { x: new Date('2024-09-01').getTime(), y: 4100 },
                { x: new Date('2024-09-05').getTime(), y: 4300 },
                { x: new Date('2024-09-10').getTime(), y: 4500 },
                { x: new Date('2024-09-15').getTime(), y: 4700 },
                { x: new Date('2024-09-20').getTime(), y: 4800 },
                { x: new Date('2024-09-25').getTime(), y: 4600 },
                { x: new Date('2024-10-01').getTime(), y: 4400 },
                { x: new Date('2024-10-10').getTime(), y: 4200 },
                { x: new Date('2024-10-15').getTime(), y: 4000 }
            ]
        }],
        xaxis: {
            type: 'datetime'
        },
        yaxis: {
            title: {
                text: 'Unique Visitors',
                offsetX: -5,
                style: {
                    fontSize: '14px',
                    fontWeight: 500,
                },
            },
        },
        grid: {
            row: {
                colors: ['transparent', 'transparent'],
                opacity: 0.2
            },
            borderColor: '#dee2e6',
            padding: {
                right: 20
            }
        },
        responsive: [{
            breakpoint: 600,
            options: {
                chart: {
                    toolbar: {
                        show: false
                    }
                },
                legend: {
                    show: false
                }
            }
        }]
    })
});


//
// Syncing charts
//
new CustomApexChart({
    selector: '#line-chart-syncing',
    options: () => ({
        chart: {
            type: 'line',
            height: 160,
            id: 'fb',
            group: 'social',
            toolbar: { show: false },
        },
        colors: [ins('primary')],
        stroke: {
            width: [3],
            curve: 'straight'
        },
        fill: {
            opacity: 1,
        },
        tooltip: {
            followCursor: false,
            theme: 'light',
            x: {
                show: false
            },
            marker: {
                show: false
            },
            y: {
                formatter: function (val) {
                    return val
                }
            }
        },
        series: [{
            data: [
                [new Date('2024-05-01').getTime(), 28],
                [new Date('2024-05-02').getTime(), 35],
                [new Date('2024-05-03').getTime(), 32],
                [new Date('2024-05-04').getTime(), 30],
                [new Date('2024-05-05').getTime(), 34],
                [new Date('2024-05-06').getTime(), 38],
                [new Date('2024-05-07').getTime(), 36],
                [new Date('2024-05-08').getTime(), 40],
                [new Date('2024-05-09').getTime(), 42],
                [new Date('2024-05-10').getTime(), 39]
            ]
        }],
        xaxis: {
            type: 'datetime',
            labels: {
                datetimeFormatter: {
                    day: 'dd MMM'
                }
            }
        },
        grid: {
            row: {
                colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.2
            },
            borderColor: [ins('border-color')],
            padding: { right: 20 }
        }
    })
})


// 
// Syncing Chart-2
//
new CustomApexChart({
    selector: '#line-chart-syncing2',
    options: () => ({
        chart: {
            height: 200,
            type: 'line',
            id: 'yt',
            group: 'social',
            toolbar: { show: false },
        },
        colors: [ins('danger')],
        dataLabels: {
            enabled: false
        },
        tooltip: {
            followCursor: false,
            theme: 'light',
            x: {
                show: false
            },
            marker: {
                show: false
            },
            y: {
                formatter: function (val) {
                    return val
                }
            }
        },
        stroke: {
            width: [3],
            curve: 'smooth'
        },
        series: [{
            data: [
                [new Date('2024-05-01').getTime(), 120],
                [new Date('2024-05-02').getTime(), 160],
                [new Date('2024-05-03').getTime(), 150],
                [new Date('2024-05-04').getTime(), 180],
                [new Date('2024-05-05').getTime(), 170],
                [new Date('2024-05-06').getTime(), 200],
                [new Date('2024-05-07').getTime(), 190],
                [new Date('2024-05-08').getTime(), 210],
                [new Date('2024-05-09').getTime(), 230],
                [new Date('2024-05-10').getTime(), 240]
            ]
        }],
        fill: {
            gradient: {
                enabled: true,
                opacityFrom: 0.6,
                opacityTo: 0.8,
            }
        },
        legend: {
            position: 'top',
            horizontalAlign: 'left'
        },
        xaxis: {
            type: 'datetime',
            labels: {
                datetimeFormatter: {
                    day: 'dd MMM'
                }
            }
        },
        grid: {
            row: {
                colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.2
            },
            borderColor: [ins('border-color')],
            padding: { right: 20 }
        }
    })
})


//
// Gradient Line Chart
//
new CustomApexChart({
    selector: '#line-chart-gradient',
    options: () => ({
        chart: {
            height: 374,
            type: 'line',
            toolbar: { show: false },
            shadow: {
                enabled: false,
                color: '#bbb',
                top: 3,
                left: 2,
                blur: 3,
                opacity: 1
            },
        },
        forecastDataPoints: {
            count: 7
        },
        stroke: {
            width: 5,
            curve: 'smooth'
        },
        series: [{
            name: 'Followers',
            data: [3, 5, 9, 12, 18, 25, 21, 17, 13, 19, 23, 16, 20, 22, 19, 15, 11, 14]
        }],
        xaxis: {
            type: 'datetime',
            categories: [
                '01/01/2000', '02/01/2000', '03/01/2000', '04/01/2000', '05/01/2000', '06/01/2000',
                '07/01/2000', '08/01/2000', '09/01/2000', '10/01/2000', '11/01/2000', '12/01/2000',
                '01/01/2001', '02/01/2001', '03/01/2001', '04/01/2001', '05/01/2001', '06/01/2001'
            ]
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                gradientToColors: ['#007bff'],
                shadeIntensity: 1,
                type: 'vertical',
                opacityFrom: 0.8,
                opacityTo: 1,
                stops: [0, 100]
            },
        },
        markers: {
            size: 4,
            opacity: 0.9,
            colors: ["#ffbc00"],
            strokeColor: "#fff",
            strokeWidth: 2,
            style: 'inverted', // full, hollow, inverted
            hover: {
                size: 7,
            }
        },
        yaxis: {
            min: -10,
            max: 40,
            title: {
                text: 'Followers Count',
                offsetX: -5,
                style: {
                    fontSize: '14px',
                    fontWeight: 500,
                }
            },
        },
        grid: {
            row: {
                colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.2
            },
            borderColor: [ins('border-color')],
            padding: { right: 20 }
        },
        responsive: [{
            breakpoint: 600,
            options: {
                chart: {
                    toolbar: {
                        show: false
                    }
                },
                legend: {
                    show: false
                },
            }
        }]
    })
})


//
// Missing Data
//
new CustomApexChart({
    selector: '#line-chart-missing',
    options: () => ({
        chart: {
            height: 380,
            type: 'line',
            zoom: {
                enabled: false
            },
            animations: {
                enabled: false
            },
            toolbar: { show: false },
        },
        stroke: {
            width: [5, 5, 4],
            curve: 'straight'
        },
        series: [{
            name: 'Slack',
            data: [45, 50, 48, 60, 42, 55, null, 56, null, 60, null, 66, 50, 69, 75, 71]
        }, {
            name: 'Zoom',
            data: [30, 28, 35, null, 25, 42, 39, null, 47, 32, 50, 41, null, 53, 45, 55]
        }, {
            name: 'Notion',
            data: [null, 25, 35, 20, 30, 22, 38, null, 34, 29, 37, 39, 45, 41, 33, 44]
        }],
        labels: [
            '01 Jan', '02 Jan', '03 Jan', '04 Jan', '05 Jan', '06 Jan',
            '07 Jan', '08 Jan', '09 Jan', '10 Jan', '11 Jan', '12 Jan',
            '13 Jan', '14 Jan', '15 Jan', '16 Jan'
        ],
        colors: [ins('secondary'), ins('warning'), ins('info')],
        grid: {
            row: {
                colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.2
            },
            borderColor: [ins('border-color')],
            padding: {
                bottom: 5
            }
        },
        legend: {
            offsetY: 5,
        }
    })
})


//
// Dashed line chart
//
new CustomApexChart({
    selector: '#line-chart-dashed',
    options: () => ({
        chart: {
            height: 380,
            type: 'line',
            zoom: {
                enabled: false
            },
            toolbar: { show: false },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            width: [3, 5, 3],
            curve: 'straight',
            dashArray: [0, 8, 5]
        },
        series: [{
            name: "Charging Time",
            data: [30, 45, 28, 20, 36, 25, 22, 18, 10, 12, 20, 15]
        }, {
            name: "Energy Delivered",
            data: [22, 35, 55, 38, 16, 21, 33, 40, 39, 53, 30, 34]
        }, {
            name: "Sessions Completed",
            data: [60, 50, 65, 85, 58, 40, 70, 60, 90, 63, 48, 52]
        }],
        markers: {
            size: 0,
            style: 'hollow', // full, hollow, inverted
        },
        xaxis: {
            categories: [
                '01 Mar', '02 Mar', '03 Mar', '04 Mar', '05 Mar', '06 Mar',
                '07 Mar', '08 Mar', '09 Mar', '10 Mar', '11 Mar', '12 Mar'
            ]
        },
        colors: [ins('primary'), ins('secondary'), ins('gray')],
        tooltip: {
            y: {
                title: {
                    formatter: function (seriesName) {
                        if (seriesName === 'Charging Time') return 'Charging Time (mins)';
                        else if (seriesName === 'Energy Delivered') return 'Energy Delivered (kWh)';
                        else if (seriesName === 'Sessions Completed') return 'Sessions';
                        return seriesName;
                    }
                }
            }
        },
        grid: {
            borderColor: [ins('border-color')],
        },
        legend: {
            offsetY: 7,
        }
    })
})


// 
// Stepline Charts
//
new CustomApexChart({
    selector: '#line-chart-stepline',
    options: () => ({
        chart: {
            type: 'line',
            height: 360,
            toolbar: { show: false },
        },
        stroke: {
            curve: 'stepline',
        },
        dataLabels: {
            enabled: false
        },
        series: [{
            data: [120, 115, 130, 90, 70, 95, 85, 75, 140, 140, 125]
        }],
        colors: [ins('purple')],
        markers: {
            hover: {
                sizeOffset: 4
            }
        },
        grid: {
            padding: { right: 20 }
        }

    })
})


const common = generateDayWiseTimeSeries(new Date('01 Jan 2024').getTime(), 185, {
    min: 40,
    max: 90
});

new CustomApexChart({
    selector: '#chart-line2',
    options: () => ({
        series: [{
            data: common
        }],
        chart: {
            id: 'chart2',
            type: 'line',
            height: 230,
            toolbar: {
                autoSelected: 'pan',
                show: false
            }
        },
        colors: [ins('secondary')],
        stroke: {
            width: 3
        },
        dataLabels: {
            enabled: false
        },
        fill: {
            opacity: 1,
        },
        markers: {
            size: 0
        },
        xaxis: {
            type: 'datetime'
        }
    })
})

new CustomApexChart({
    selector: '#chart-line',
    options: () => ({
        series: [{
            data: common
        }],
        chart: {
            id: 'chart1',
            height: 130,
            type: 'area',
            brush: {
                target: 'chart2',
                enabled: true
            },
            selection: {
                enabled: true,
                xaxis: {
                    min: new Date('15 Mar 2024').getTime(),
                    max: new Date('15 May 2024').getTime()
                }
            },
        },
        colors: [ins('secondary')],
        fill: {
            type: 'gradient',
            gradient: {
                opacityFrom: 0.91,
                opacityTo: 0.1,
            }
        },
        xaxis: {
            type: 'datetime',
            tooltip: {
                enabled: false
            }
        },
        yaxis: {
            tickAmount: 2
        }
    })
})


//
// Realtime chart
//
let lastDate = 0;
let data = generateDayWiseTimeSeries(new Date('11 May 2024 GMT').getTime(), 10, {
    min: 10,
    max: 90
});
lastDate = data[data.length - 1][0]; // ✅ Set after generating

function getNewSeries(baseval, yrange) {
    const newDate = baseval + 86400000;
    lastDate = newDate;
    data.push([
        newDate,
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min
    ]);
}

function resetData() {
    data = data.slice(data.length - 10, data.length);
}

const realtimeChart = new CustomApexChart({
    selector: '#line-chart-realtime',
    options: () => ({
        chart: {
            height: 350,
            type: 'line',
            animations: {
                enabled: true,
                easing: 'linear',
                dynamicAnimation: {
                    speed: 2000
                }
            },
            toolbar: {
                show: false
            },
            zoom: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: [3],
        },
        colors: [ins('primary')],
        series: [{
            data: data
        }],
        markers: {
            size: 0
        },
        xaxis: {
            type: 'datetime',
            range: 777600000
        },
        yaxis: {
            max: 100
        },
        legend: {
            show: false
        },
        grid: {
            borderColor: [ins('border-color')],
        }
    })
})

window.setInterval(() => {
    if (!realtimeChart || !realtimeChart.chart) return;
    getNewSeries(lastDate, {
        min: 10,
        max: 90
    });

    realtimeChart.chart.updateSeries([{
        data: data
    }]);
}, 2000);

// Reset data every 60 seconds
window.setInterval(() => {
    if (!realtimeChart || !realtimeChart.chart) return;
    resetData();
    realtimeChart.chart.updateSeries([{
        data: data
    }], false, true);
}, 60000);
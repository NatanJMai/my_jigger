/**
 * Template Name: UBold - Admin & Dashboard Template
 * By (Author): Coderthemes
 * Module/App (File Name): Chart Apex Column
 */
//
// BASIC COLUMN CHART
//
import { CustomApexChart , ins} from '../app'

new CustomApexChart({
    selector: '#basic-column',
    options: () => ({
        chart: {
            height: 350,
            type: 'bar',
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                endingShape: 'flat', // or 'rounded' if you want soft rounding
                columnWidth: '65%',
                borderRadius: 6, // Apply radius to top
                borderRadiusApplication: 'end', // Applies only to the top for vertical bars
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        colors: [ins('primary'), ins('secondary'), ins('info')],
        series: [{
            name: 'Net Profit',
            data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
        }, {
            name: 'Revenue',
            data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
        }, {
            name: 'Free Cash Flow',
            data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
        }],
        xaxis: {
            categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        },
        legend: {
            offsetY: 5,
        },
        yaxis: {
            title: {
                text: '$ (thousands)',
                offsetX: 0,
                style: {
                    fontSize: '14px',    // Change to any size you prefer
                    fontWeight: 500,     // Sets font weight
                }
            },
            labels: {
                offsetX: -7 // 👈 Negative value pulls labels closer to the chart
            }
        },
        fill: {
            opacity: 1
        },
        grid: {
            row: {
                colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.2
            },
            borderColor: [ins('border-color')],
            padding: {
                top: -20,   // You can use negative or positive values here
                right: 0,
                bottom: -5,
                left: 5
            }
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return "$ " + val + " thousands"
                }
            }
        }
    })
})


//
// COLUMN CHART WITH DATALABELS
//
new CustomApexChart({
    selector: '#datalabels-column',
    options: () => ({
        chart: {
            height: 350,
            type: 'bar',
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                borderRadius: 10,
                dataLabels: {
                    position: 'top', // top, center, bottom
                },
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return val + "%";
            },
            offsetY: -25,
            style: {
                fontSize: '12px',
                colors: [ins('body-color')]
            }
        },
        colors: [ins('secondary')],
        legend: {
            show: true,
            horizontalAlign: "center",
            offsetX: 0,
            offsetY: -5,
        },
        series: [{
            name: 'Inflation',
            data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2]
        }],
        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            position: 'top',
            labels: {
                offsetY: 0,
            },
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            },
            tooltip: {
                enabled: true,
                offsetY: -10,
            }
        },
        yaxis: {
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false,
            },
            labels: {
                show: false,
                formatter: function (val) {
                    return val + "%";
                }
            }

        },
        title: {
            text: 'Monthly Inflation in Argentina, 2025',
            floating: true,
            offsetY: 330,
            align: 'center',
            style: {
                color: ins('body-color'),
                fontSize: '14px',
                fontWeight: 500
            }
        },
        grid: {
            row: {
                colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.2
            },
            borderColor: [ins('border-color')]
        }
    })
})


//
// STACKED COLUMN CHART
//
new CustomApexChart({
    selector: '#stacked-column',
    options: () => ({
        chart: {
            height: 350,
            type: 'bar',
            stacked: true,
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '50%',
            },
        },
        series: [{
            name: 'iPhone 16',
            data: [65, 59, 80, 81, 56, 55, 40, 72]
        }, {
            name: 'iPhone 16 Pro',
            data: [28, 48, 40, 19, 86, 27, 90, 50]
        }, {
            name: 'iPhone 15',
            data: [35, 29, 50, 45, 60, 33, 38, 47]
        }],
        xaxis: {
            categories: ['2023 Q1', '2023 Q2', '2023 Q3', '2023 Q4', '2024 Q1', '2024 Q2', '2024 Q3', '2024 Q4'],
        },
        yaxis: {
            labels: {
                offsetX: -10
            }
        },
        colors: [ins('primary'), ins('secondary'), ins('info'), ins('danger')],
        fill: {
            opacity: 1
        },
        legend: {
            offsetY: 7,
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return +val + " Orders"
                }
            }
        },
        grid: {
            row: {
                colors: ['transparent', 'transparent'],
                opacity: 0.2
            },
            borderColor: [ins('border-color')],
            padding: {
                top: -20,
                right: 0,
                bottom: -5,
                left: 0
            }
        }
    })
})


//
// 100% STACKED COLUMN CHART
//
new CustomApexChart({
    selector: '#full-stacked-column',
    options: () => ({
        chart: {
            height: 350,
            type: 'bar',
            stacked: true,
            stackType: '100%',
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                columnWidth: '50%',
            },
        },
        series: [{
            name: 'iPhone 16',
            data: [44, 55, 41, 67, 22, 43, 21, 49]
        }, {
            name: 'iPhone 16 Pro',
            data: [13, 23, 20, 8, 13, 27, 33, 12]
        }, {
            name: 'iPhone 15',
            data: [11, 17, 15, 15, 21, 14, 15, 13]
        }],
        xaxis: {
            categories: ['2023 Q1', '2023 Q2', '2023 Q3', '2023 Q4', '2024 Q1', '2024 Q2', '2024 Q3', '2024 Q4'],
        },
        yaxis: {
            labels: {
                offsetX: -10
            }
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return +val + " Orders"
                }
            }
        },
        legend: {
            offsetY: 7,
        },
        colors: [ins('success'), ins('info'), ins('warning')],
        grid: {
            row: {
                colors: ['transparent', 'transparent'],
                opacity: 0.2
            },
            borderColor: [ins('border-color')],
            padding: {
                top: -20,
                right: 0,
                bottom: -5,
                left: 0
            }
        }
    })
})


//
// Grouped Stacked Columns Chart
//
new CustomApexChart({
    selector: '#grouped-stacked-column',
    options: () => ({
        series: [
            {
                name: 'Q1 Budget',
                group: 'budget',
                data: [44000, 55000, 41000, 67000, 22000, 43000]
            },
            {
                name: 'Q1 Actual',
                group: 'actual',
                data: [48000, 50000, 40000, 65000, 25000, 40000]
            },
            {
                name: 'Q2 Budget',
                group: 'budget',
                data: [13000, 36000, 20000, 8000, 13000, 27000]
            },
            {
                name: 'Q2 Actual',
                group: 'actual',
                data: [20000, 40000, 25000, 10000, 12000, 28000]
            }
        ],
        chart: {
            type: 'bar',
            height: 350,
            stacked: true,
        },
        stroke: {
            width: 1,
            colors: ['#fff']
        },
        dataLabels: {
            formatter: (val) => {
                return val / 1000 + 'K'
            }
        },
        plotOptions: {
            bar: {
                horizontal: false
            }
        },
        xaxis: {
            categories: [
                'Online advertising',
                'Sales Training',
                'Print advertising',
                'Catalogs',
                'Meetings',
                'Public relations'
            ]
        },
        fill: {
            opacity: 1
        },
        colors: [ins('primary-rgb', 0.7), ins('primary'), ins('secondary-rgb', 0.7), ins('secondary')],
        yaxis: {
            labels: {
                formatter: (val) => {
                    return val / 1000 + 'K'
                },
                offsetX: -10 // 👈 Negative value pulls labels closer to the chart
            }
        },
        legend: {
            position: 'top',
            horizontalAlign: 'center',
            offsetY: -8
        },
        grid: {
            borderColor: [ins('border-color')],
            padding: {
                top: -20,   // You can use negative or positive values here
                right: -30,
                bottom: -5,
                left: 5
            }
        }
    })
})


//
// Dumbbell Chart
//
new CustomApexChart({
    selector: '#dumbbell-chart',
    options: () => ({
        series: [
            {
                data: [
                    {
                        x: '2019',
                        y: [2400, 4300]
                    },
                    {
                        x: '2020',
                        y: [3000, 4800]
                    },
                    {
                        x: '2021',
                        y: [3200, 7200]
                    },
                    {
                        x: '2022',
                        y: [3500, 5100]
                    },
                    {
                        x: '2023',
                        y: [4000, 5300]
                    },
                    {
                        x: '2024',
                        y: [4700, 6700]
                    },
                    {
                        x: '2025',
                        y: [4200, 6000]
                    }
                ]
            }
        ],
        chart: {
            height: 350,
            type: 'rangeBar',
            zoom: {
                enabled: false
            }
        },
        plotOptions: {
            bar: {
                isDumbbell: true,
                columnWidth: 3,
                dumbbellColors: [[ins('secondary'), ins('success')]]
            }
        },
        legend: {
            show: true,
            offsetY: -8,
            showForSingleSeries: true,
            position: 'top',
            horizontalAlign: 'center',
            customLegendItems: ['Product A', 'Product B']
        },
        fill: {
            type: 'gradient',
            gradient: {
                type: 'vertical',
                gradientToColors: [ins('success')],
                inverseColors: true,
                stops: [0, 100]
            }
        },
        grid: {
            xaxis: {
                lines: {
                    show: true
                }
            },
            yaxis: {
                lines: {
                    show: false
                }
            },
            borderColor: [ins('border-color')],
            padding: {
                top: -20,   // You can use negative or positive values here
                right: 0,
                bottom: -15,
                left: 5
            }
        },
        colors: [ins('primary'), ins('secondary')],
        xaxis: {
            tickPlacement: 'on',
            axisBorder: {
                show: true,
                color: ins('border-color')  // 👈 Sets the x-axis border color
            },
            axisTicks: {
                show: true,
                color: ins('border-color')  // Optional: changes tick color to match
            }
        },
        yaxis: {
            labels: {
                offsetX: -10
            }
        }
    })
})


//
// COLUMN WITH MARKERS
//
new CustomApexChart({
    selector: '#column-with-markers',
    options: () => ({
        series: [{
            name: 'Actual',
            data: [{
                x: '2018',
                y: 1292,
                goals: [{
                    name: 'Expected',
                    value: 1400,
                    strokeHeight: 5,
                    strokeColor: ins('secondary')
                }]
            },
                {
                    x: '2029',
                    y: 4432,
                    goals: [{
                        name: 'Expected',
                        value: 5400,
                        strokeHeight: 5,
                        strokeColor: ins('secondary')
                    }]
                },
                {
                    x: '2020',
                    y: 5423,
                    goals: [{
                        name: 'Expected',
                        value: 5200,
                        strokeHeight: 5,
                        strokeColor: ins('secondary')
                    }]
                },
                {
                    x: '2021',
                    y: 6653,
                    goals: [{
                        name: 'Expected',
                        value: 6500,
                        strokeHeight: 5,
                        strokeColor: ins('secondary')
                    }]
                },
                {
                    x: '2022',
                    y: 8133,
                    goals: [{
                        name: 'Expected',
                        value: 6600,
                        strokeHeight: 13,
                        strokeWidth: 0,
                        strokeLineCap: 'round',
                        strokeColor: ins('secondary')
                    }]
                },
                {
                    x: '2023',
                    y: 7132,
                    goals: [{
                        name: 'Expected',
                        value: 7500,
                        strokeHeight: 5,
                        strokeColor: ins('secondary')
                    }]
                },
                {
                    x: '2024',
                    y: 7332,
                    goals: [{
                        name: 'Expected',
                        value: 8700,
                        strokeHeight: 5,
                        strokeColor: ins('secondary')
                    }]
                },
                {
                    x: '2025',
                    y: 6553,
                    goals: [{
                        name: 'Expected',
                        value: 7300,
                        strokeHeight: 2,
                        strokeDashArray: 2,
                        strokeColor: ins('secondary')
                    }]
                }
            ]
        }],
        chart: {
            height: 350,
            type: 'bar'
        },
        plotOptions: {
            bar: {
                columnWidth: '60%'
            }
        },
        colors: [ins('primary'), ins('secondary')],
        dataLabels: {
            enabled: false
        },
        yaxis: {
            labels: {
                offsetX: -10
            }
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val + " Sales";
                }
            }
        },
        legend: {
            show: true,
            showForSingleSeries: true,
            customLegendItems: ['Actual', 'Expected'],
            markers: {
                fillColors: [ins('primary'), ins('secondary')]
            }
        },
        grid: {
            borderColor: [ins('border-color')],
            padding: {
                top: -20,
                right: 0,
                bottom: -5,
                left: 0
            }
        }
    })
})


//
// COLUMN WITH GROUP LABEL
//
dayjs.extend(window.dayjs_plugin_quarterOfYear)

new CustomApexChart({
    selector: '#column-with-group-label',
    options: () => ({
        series: [{
            name: "Sales",
            data: [{
                x: '2024/01/01',
                y: 400
            }, {
                x: '2024/04/01',
                y: 430
            }, {
                x: '2024/07/01',
                y: 448
            }, {
                x: '2024/10/01',
                y: 470
            }, {
                x: '2025/01/01',
                y: 540
            }, {
                x: '2025/04/01',
                y: 580
            }, {
                x: '2025/07/01',
                y: 690
            }, {
                x: '2025/10/01',
                y: 690
            }]
        }],
        chart: {
            type: 'bar',
            height: 350,
            toolbar: {
                show: false,
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '45%',
            },
        },
        colors: [ins('secondary')],
        xaxis: {
            type: 'category',
            labels: {
                formatter: function (val) {
                    return "Q" + dayjs(val).quarter()
                },
                style: {
                    fontSize: '12px',
                    fontWeight: 600
                }
            },
            group: {
                style: {
                    fontSize: '12px',
                    fontWeight: 700
                },
                groups: [{
                    title: '2024',
                    cols: 4
                },
                    {
                        title: '2025',
                        cols: 4
                    }
                ]
            }
        },
        yaxis: {
            labels: {
                offsetX: -10
            }
        },
        tooltip: {
            x: {
                formatter: function (val) {
                    return "Q" + dayjs(val).quarter() + " " + dayjs(val).format("YYYY")
                }
            }
        },
        grid: {
            borderColor: [ins('border-color')],
            padding: {
                top: -20,
                right: 0,
                bottom: -15,
                left: 0
            }
        }
    })
})


//
// COLUMN CHART WITH ROTATED LABELS & ANNOTATIONS
//
new CustomApexChart({
    selector: '#rotate-labels-column',
    options: () => ({
        annotations: {
            points: [{
                x: 'Bananas',
                seriesIndex: 0,
                label: {
                    borderColor: ins('secondary'),
                    offsetY: 0,
                    style: {
                        color: '#fff',
                        background: ins('secondary'),
                    },
                    text: 'Bananas are good',
                }
            }]
        },
        chart: {
            height: 350,
            type: 'bar',
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                columnWidth: '50%',
                borderRadius: 10
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            width: 2
        },
        colors: [ins('primary')],
        series: [{
            name: 'Servings',
            data: [44, 55, 41, 67, 22, 43, 21, 33, 45, 31, 87, 65, 35]
        }],
        grid: {
            borderColor: [ins('border-color')],
            padding: {
                top: 0,
                right: -2,
                bottom: -35,
                left: 10,
            },
        },
        xaxis: {
            labels: {
                rotate: -45
            },
            categories: ['Apples', 'Oranges', 'Strawberries', 'Pineapples', 'Mangoes', 'Bananas',
                'Blackberries', 'Pears', 'Watermelons', 'Cherries', 'Pomegranates', 'Tangerines', 'Papayas'
            ],
        },
        yaxis: {
            title: {
                text: 'Servings',
                style: {
                    fontSize: '14px',    // Change to any size you prefer
                    fontWeight: 500,     // Sets font weight
                }
            },
            labels: {
                offsetX: -10 // 👈 Negative value pulls labels closer to the chart
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'light',
                type: "horizontal",
                shadeIntensity: 0.25,
                gradientToColors: undefined,
                inverseColors: true,
                opacityFrom: 0.85,
                opacityTo: 0.85,
                stops: [50, 0, 100]
            },
        },

    })
})


//
// COLUMN CHART WITH NEGATIVE VALUES
//
new CustomApexChart({
    selector: '#negative-value-column',
    options: () => ({
        chart: {
            height: 350,
            type: 'bar',
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                colors: {
                    ranges: [{
                        from: -100,
                        to: -46,
                        color: ins('danger')
                    }, {
                        from: -45,
                        to: 0,
                        color: ins('warning')
                    }]
                },
                columnWidth: '80%',
                borderRadius: 6, // Apply radius to top
                borderRadiusApplication: 'end', // Applies only to the top for vertical bars
            }
        },
        dataLabels: {
            enabled: false,
        },
        colors: [ins('primary')],
        series: [{
            name: 'Cash Flow',
            data: [1.45, 5.42, 5.9, -0.42, -12.6, -18.1, -18.2, -14.16, -11.1, -6.09, 0.34, 3.88, 13.07,
                5.8, 2, 7.37, 8.1, 13.57, 15.75, 17.1, 19.8, -27.03, -54.4, -47.2, -43.3, -18.6, -
                    48.6, -41.1, -39.6, -37.6, -29.4, -21.4, -2.4
            ]
        }],
        yaxis: {
            title: {
                text: 'Growth',
                style: {
                    fontSize: '14px',    // Change to any size you prefer
                    fontWeight: 500,     // Sets font weight
                }
            },
            labels: {
                formatter: function (y) {
                    return y.toFixed(0) + "%";
                },
                offsetX: -10 // 👈 Negative value pulls labels closer to the chart
            }

        },
        xaxis: {
            //type: 'datetime',
            categories: [
                '2011-01-01', '2011-02-01', '2011-03-01', '2011-04-01', '2011-05-01', '2011-06-01',
                '2011-07-01', '2011-08-01', '2011-09-01', '2011-10-01', '2011-11-01', '2011-12-01',
                '2012-01-01', '2012-02-01', '2012-03-01', '2012-04-01', '2012-05-01', '2012-06-01',
                '2012-07-01', '2012-08-01', '2012-09-01', '2012-10-01', '2012-11-01', '2012-12-01',
                '2013-01-01', '2013-02-01', '2013-03-01', '2013-04-01', '2013-05-01', '2013-06-01',
                '2013-07-01', '2013-08-01', '2013-09-01'
            ],
            labels: {
                rotate: -90
            }
        },
        grid: {
            borderColor: [ins('border-color')],
            padding: {
                top: -20,
                right: 10,
                bottom: -25,
                left: 10,
            },
        },
    })
})


//
// DISTRIBUTED COLUMN CHART
//
new CustomApexChart({
    selector: '#distributed-column',
    options: () => ({
        chart: {
            height: 350,
            type: 'bar',
            toolbar: {
                show: false
            },
            events: {
                click: function (chart, w, e) {
                    console.log(chart, w, e)
                }
            },
        },
        colors: [ins('primary'), ins('secondary'), ins('info'), ins('danger'), ins('success'), ins('warning'), ins('purple'), ins('orange')],
        plotOptions: {
            bar: {
                columnWidth: '45%',
                distributed: true
            }
        },
        dataLabels: {
            enabled: false,
        },
        series: [{
            data: [21, 22, 10, 28, 16, 21, 13, 30]
        }],
        xaxis: {
            categories: ['John', 'Joe', 'Jake', 'Amber', 'Peter', 'Mary', 'David', 'Lily'],
            labels: {
                style: {
                    fontSize: '14px'
                }
            }
        },
        yaxis: {
            labels: {
                offsetX: -10
            }
        },
        legend: {
            offsetY: 7
        },
        grid: {
            borderColor: [ins('border-color')],
            padding: {
                top: -20,
                right: 10,
                bottom: -8,
                left: 10,
            },
        },
    })
})


//
// Range Column Chart
//
new CustomApexChart({
    selector: '#range-column',
    options: () => ({
        chart: {
            height: 350,
            type: 'rangeBar',
        },
        plotOptions: {
            bar: {
                horizontal: false
            }
        },
        dataLabels: {
            enabled: true
        },
        legend: {
            offsetY: 7
        },
        yaxis: {
            labels: {
                offsetX: -10
            }
        },
        grid: {
            borderColor: [ins('border-color')],
            padding: {
                top: -20,   // You can use negative or positive values here
                right: 0,
                bottom: -5,
                left: 0
            }
        },
        colors: [ins('primary'), ins('secondary')],
        series: [{
            name: 'Product A',
            data: [{
                x: 'Team A',
                y: [1, 5]
            }, {
                x: 'Team B',
                y: [4, 6]
            }, {
                x: 'Team C',
                y: [5, 8]
            }, {
                x: 'Team D',
                y: [3, 11]
            }]
        }, {
            name: 'Product B',
            data: [{
                x: 'Team A',
                y: [2, 6]
            }, {
                x: 'Team B',
                y: [1, 3]
            }, {
                x: 'Team C',
                y: [7, 8]
            }, {
                x: 'Team D',
                y: [5, 9]
            }]
        }],

    })
})


//
// DYNAMIC LOADED CHART
//

Apex = {
    chart: {
        toolbar: {
            show: false
        }
    },
    tooltip: {
        shared: false
    },
    legend: {
        show: false
    }
}

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

const arrayData = [
    {
        y: 400,
        quarters: [{
            x: 'Q1',
            y: 120
        }, {
            x: 'Q2',
            y: 90
        }, {
            x: 'Q3',
            y: 100
        }, {
            x: 'Q4',
            y: 90
        }]
    }, {
        y: 430,
        quarters: [{
            x: 'Q1',
            y: 120
        }, {
            x: 'Q2',
            y: 110
        }, {
            x: 'Q3',
            y: 90
        }, {
            x: 'Q4',
            y: 110
        }]
    }, {
        y: 448,
        quarters: [{
            x: 'Q1',
            y: 70
        }, {
            x: 'Q2',
            y: 100
        }, {
            x: 'Q3',
            y: 140
        }, {
            x: 'Q4',
            y: 138
        }]
    }, {
        y: 470,
        quarters: [{
            x: 'Q1',
            y: 150
        }, {
            x: 'Q2',
            y: 60
        }, {
            x: 'Q3',
            y: 190
        }, {
            x: 'Q4',
            y: 70
        }]
    }, {
        y: 540,
        quarters: [{
            x: 'Q1',
            y: 120
        }, {
            x: 'Q2',
            y: 120
        }, {
            x: 'Q3',
            y: 130
        }, {
            x: 'Q4',
            y: 170
        }]
    }, {
        y: 580,
        quarters: [{
            x: 'Q1',
            y: 170
        }, {
            x: 'Q2',
            y: 130
        }, {
            x: 'Q3',
            y: 120
        }, {
            x: 'Q4',
            y: 160
        }]
    }];

function makeData() {
    const dataSet = shuffleArray([...arrayData]);
    const tokens = ['primary', 'secondary', 'info', 'danger', 'warning', 'success'];

    return dataSet.map((item, index) => ({
        x: String(2019 + index),
        y: item.y,
        colorToken: tokens[index],
        quarters: item.quarters
    }));
}

function updateQuarterChart(sourceChart, destChartIDToUpdate) {
    const selected = sourceChart.w.globals.selectedDataPoints[0];
    const sourceSeries = sourceChart.w.config.series[0];
    const series = [];
    const colors = [];

    selected?.forEach(i => {
        const item = sourceSeries.data[i];
        series.push({ name: item.x, data: item.quarters });
        colors.push(ins(item.colorToken));
    });

    ApexCharts.exec(destChartIDToUpdate, 'updateOptions', {
        series,
        colors,
        fill: { colors }
    });
}

const getYearlyOptions = () => {
    const data = makeData();
    const resolvedColors = data.map(d => ins(d.colorToken));

    return {
        series: [{ data }],
        chart: {
            id: 'barYear',
            height: 400,
            width: '100%',
            type: 'bar',
            events: {
                dataPointSelection: function (e, chart, opts) {
                    const quarterChartEl = document.querySelector("#chart-quarter");
                    const yearChartEl = document.querySelector("#chart-year");

                    if (opts.selectedDataPoints[0].length === 1) {
                        if (quarterChartEl.classList.contains("active")) {
                            updateQuarterChart(chart, 'barQuarter');
                        } else {
                            yearChartEl.classList.add("chart-quarter-activated");
                            quarterChartEl.classList.add("active");
                            updateQuarterChart(chart, 'barQuarter');
                        }
                    } else {
                        updateQuarterChart(chart, 'barQuarter');
                    }

                    if (opts.selectedDataPoints[0].length === 0) {
                        yearChartEl.classList.remove("chart-quarter-activated");
                        quarterChartEl.classList.remove("active");
                    }
                },
                updated: function (chart) {
                    updateQuarterChart(chart, 'barQuarter');
                }
            }
        },
        plotOptions: {
            bar: {
                distributed: true,
                horizontal: true,
                barHeight: '75%',
                dataLabels: { position: 'bottom' }
            }
        },
        dataLabels: {
            enabled: true,
            textAnchor: 'none',
            style: { colors: ['#fff'] },
            formatter: (val, opt) => opt.w.globals.labels[opt.dataPointIndex],
            offsetX: 10,
            dropShadow: { enabled: true }
        },
        colors: resolvedColors,
        states: {
            normal: { filter: { type: 'desaturate' } },
            active: {
                allowMultipleDataPointsSelection: true,
                filter: { type: 'darken', value: 1 }
            }
        },
        tooltip: {
            x: { show: false },
            y: {
                title: {
                    formatter: (val, opts) => opts.w.globals.labels[opts.dataPointIndex]
                }
            }
        },
        title: {
            text: 'Yearly Results',
            offsetX: 5,
            style: { fontSize: '14px', fontWeight: 700 }
        },
        subtitle: {
            text: '(Click on bar to see details)',
            offsetX: 5,
            style: { fontSize: '12px', fontWeight: 500 }
        },
        xaxis: { axisBorder: { show: false } },
        yaxis: { labels: { show: false } },
        grid: {
            borderColor: ins('border-color'),
            padding: { top: -10, right: 0, bottom: -15, left: 0 }
        }
    };
};

const getQuarterlyOptions = () => ({
    series: [{
        data: []
    }],
    chart: {
        id: 'barQuarter',
        height: 400,
        width: '100%',
        type: 'bar',
        stacked: true
    },
    plotOptions: {
        bar: {
            columnWidth: '50%',
            horizontal: false
        }
    },
    legend: {
        show: false
    },
    grid: {
        yaxis: {
            lines: {
                show: false,
            }
        },
        xaxis: {
            lines: {
                show: true,
            }
        }
    },
    xaxis: {
        axisBorder: {
            show: false,
        }
    },
    yaxis: {
        labels: {
            show: false
        }
    },
    title: {
        text: 'Quarterly Results',
        offsetX: 10,
        style: {
            fontSize: '14px',    // Change to any size you prefer
            fontWeight: 700,     // Sets font weight
        }
    },
    tooltip: {
        x: {
            formatter: function (val, opts) {
                return opts.w.globals.seriesNames[opts.seriesIndex]
            }
        },
        y: {
            title: {
                formatter: function (val, opts) {
                    return opts.w.globals.labels[opts.dataPointIndex]
                }
            }
        }
    }
});

const yearChart = document.getElementById("chart-year")
const quarterChart = document.getElementById("chart-quarter")

if (yearChart && quarterChart) {
    const chart = new ApexCharts(yearChart, getYearlyOptions());
    chart.render();

    const chartQuarter = new ApexCharts(quarterChart, getQuarterlyOptions());
    chartQuarter.render();

    chart.addEventListener('dataPointSelection', function (e, chart, opts) {
        const quarterChartEl = document.querySelector("#chart-quarter");
        const yearChartEl = document.querySelector("#chart-year");

        if (opts.selectedDataPoints[0].length === 1) {
            if (quarterChartEl.classList.contains("active")) {
                updateQuarterChart(chart, 'barQuarter')
            } else {
                yearChartEl.classList.add("chart-quarter-activated")
                quarterChartEl.classList.add("active");
                updateQuarterChart(chart, 'barQuarter')
            }
        } else {
            updateQuarterChart(chart, 'barQuarter')
        }

        if (opts.selectedDataPoints[0].length === 0) {
            yearChartEl.classList.remove("chart-quarter-activated")
            quarterChartEl.classList.remove("active");
        }

    })

    chart.addEventListener('updated', function (chart) {
        updateQuarterChart(chart, 'barQuarter')
    })

    document.querySelector("#model").addEventListener("change", function (e) {
        chart.updateSeries([{
            data: makeData()
        }])
    })

    // Watch for skin and theme changes and re-render charts
    const observer = new MutationObserver(() => {
        const selectedIndexes = chart.w.globals.selectedDataPoints?.[0] || [];

        chart.updateOptions(getYearlyOptions());

        setTimeout(() => {
            if (selectedIndexes.length > 0) {
                selectedIndexes.forEach(index => chart.toggleDataPointSelection(index));
                updateQuarterChart(chart, 'barQuarter');
                document.querySelector("#chart-year").classList.add("chart-quarter-activated");
                document.querySelector("#chart-quarter").classList.add("active");
            } else {
                document.querySelector("#chart-year").classList.remove("chart-quarter-activated");
                document.querySelector("#chart-quarter").classList.remove("active");
            }
        }, 100);
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-skin', 'data-bs-theme']
    });
}


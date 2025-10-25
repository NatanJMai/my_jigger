/**
 * Template Name: UBold - Admin & Dashboard Template
 * By (Author): Coderthemes
 * Module/App (File Name): Chart Apex Heatmap
 */
import { CustomApexChart , ins} from '../app'

function generateData(count, yrange) {
    let i = 0;
    const series = [];
    while (i < count) {
        const x = (i + 1).toString();
        const y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

        series.push({
            x: x,
            y: y
        });
        i++;
    }
    return series;
}

//
// BASIC HEATMAP - SINGLE SERIES
//
new CustomApexChart({
    selector: '#basic-heatmap',
    options: () => ({
        chart: {
            height: 350,
            type: 'heatmap',
            toolbar: {show: false}
        },
        dataLabels: {
            enabled: false
        },
        colors: [ins('primary')],
        series: [{
            name: 'Metric 1',
            data: generateData(10, {
                min: 0,
                max: 90
            })
        },
            {
                name: 'Metric 2',
                data: generateData(10, {
                    min: 0,
                    max: 90
                })
            },
            {
                name: 'Metric 3',
                data: generateData(10, {
                    min: 0,
                    max: 90
                })
            },
            {
                name: 'Metric 4',
                data: generateData(10, {
                    min: 0,
                    max: 90
                })
            },
            {
                name: 'Metric 5',
                data: generateData(10, {
                    min: 0,
                    max: 90
                })
            },
            {
                name: 'Metric  6',
                data: generateData(10, {
                    min: 0,
                    max: 90
                })
            },
            {
                name: 'Metric 7',
                data: generateData(10, {
                    min: 0,
                    max: 90
                })
            },
            {
                name: 'Metric 8',
                data: generateData(10, {
                    min: 0,
                    max: 90
                })
            },
            {
                name: 'Metric 9',
                data: generateData(10, {
                    min: 0,
                    max: 90
                })
            }
        ],
        xaxis: {
            type: 'category',
        },
        grid: {
            borderColor: [ins('border-color')],
            padding: {
                top: -25,   // You can use negative or positive values here
                right: 5,
                bottom: -15,
                left: 15
            }
        }

    })
})


//
// HEATMAP - MULTIPLE SERIES
//
new CustomApexChart({
    selector: '#multiple-series-heatmap',
    options: () => ({
        chart: {
            height: 350,
            type: 'heatmap',
            toolbar: {show: false}
        },
        dataLabels: {
            enabled: false
        },
        colors: [ins('primary'), ins('secondary'), ins('info'), ins('danger'), ins('success'), ins('warning'), ins('purple'), ins('orange')],
        series: [{
            name: 'Metric 1',
            data: generateData(15, {
                min: 0,
                max: 90
            })
        },
            {
                name: 'Metric 2',
                data: generateData(15, {
                    min: 0,
                    max: 90
                })
            },
            {
                name: 'Metric 3',
                data: generateData(15, {
                    min: 0,
                    max: 90
                })
            },
            {
                name: 'Metric 4',
                data: generateData(15, {
                    min: 0,
                    max: 90
                })
            },
            {
                name: 'Metric 5',
                data: generateData(15, {
                    min: 0,
                    max: 90
                })
            },
            {
                name: 'Metric 6',
                data: generateData(15, {
                    min: 0,
                    max: 90
                })
            },
            {
                name: 'Metric 7',
                data: generateData(15, {
                    min: 0,
                    max: 90
                })
            },
            {
                name: 'Metric 8',
                data: generateData(15, {
                    min: 0,
                    max: 90
                })
            },
            {
                name: 'Metric 9',
                data: generateData(15, {
                    min: 0,
                    max: 90
                })
            }
        ],
        xaxis: {
            type: 'category',
        },
        grid: {
            borderColor: [ins('border-color')],
            padding: {
                top: -25,   // You can use negative or positive values here
                right: 5,
                bottom: -15,
                left: 15
            }
        }
    })
})


//
// HEATMAP - COLOR RANGE
//
new CustomApexChart({
    selector: '#color-range-heatmap',
    options: () => ({
        chart: {
            height: 350,
            type: 'heatmap',
            toolbar: {show: false}
        },
        plotOptions: {
            heatmap: {
                shadeIntensity: 0.5,

                colorScale: {
                    ranges: [{
                        from: -30,
                        to: 5,
                        name: 'Low',
                        color: ins('success')
                    },
                        {
                            from: 6,
                            to: 20,
                            name: 'Medium',
                            color: ins('info')
                        },
                        {
                            from: 21,
                            to: 45,
                            name: 'High',
                            color: ins('warning')
                        },
                        {
                            from: 46,
                            to: 55,
                            name: 'Extreme',
                            color: ins('danger')
                        }
                    ]
                }
            }
        },
        dataLabels: {
            enabled: false
        },
        legend: {
            offsetY: -7,
        },
        series: [{
            name: 'Jan',
            data: generateData(20, {
                min: -30,
                max: 55
            })
        },
            {
                name: 'Feb',
                data: generateData(20, {
                    min: -30,
                    max: 55
                })
            },
            {
                name: 'Mar',
                data: generateData(20, {
                    min: -30,
                    max: 55
                })
            },
            {
                name: 'Apr',
                data: generateData(20, {
                    min: -30,
                    max: 55
                })
            },
            {
                name: 'May',
                data: generateData(20, {
                    min: -30,
                    max: 55
                })
            },
            {
                name: 'Jun',
                data: generateData(20, {
                    min: -30,
                    max: 55
                })
            },
            {
                name: 'Jul',
                data: generateData(20, {
                    min: -30,
                    max: 55
                })
            },
            {
                name: 'Aug',
                data: generateData(20, {
                    min: -30,
                    max: 55
                })
            },
            {
                name: 'Sep',
                data: generateData(20, {
                    min: -30,
                    max: 55
                })
            }
        ],
        grid: {
            borderColor: [ins('border-color')],
            padding: {
                top: -25,   // You can use negative or positive values here
                right: 5,
                bottom: -15,
                left: 15
            }
        }

    })
})


//
// HEATMAP - RANGE WITHOUT SHADES
//
new CustomApexChart({
    selector: '#rounded-heatmap',
    options: () => ({
        chart: {
            height: 350,
            type: 'heatmap',
            toolbar: {show: false}
        },
        stroke: {
            width: 0
        },
        plotOptions: {
            heatmap: {
                radius: 30,
                enableShades: false,
                colorScale: {
                    ranges: [{
                        from: 0,
                        to: 50,
                        color: ins('info')
                    },
                        {
                            from: 51,
                            to: 100,
                            color: ins('success')
                        },
                    ],
                },

            }
        },
        legend: {
            offsetY: -7,
        },
        dataLabels: {
            enabled: true,
            style: {
                colors: ['#fff']
            }
        },
        series: [{
            name: 'iPhone 11',
            data: generateData(20, {
                min: 0,
                max: 90
            })
        },
            {
                name: 'iPhone 12',
                data: generateData(20, {
                    min: 0,
                    max: 90
                })
            },
            {
                name: 'iPhone 13',
                data: generateData(20, {
                    min: 0,
                    max: 90
                })
            },
            {
                name: 'iPhone 14',
                data: generateData(20, {
                    min: 0,
                    max: 90
                })
            },
            {
                name: 'iPhone 15',
                data: generateData(20, {
                    min: 0,
                    max: 90
                })
            },
            {
                name: 'iPhone 15 Pro',
                data: generateData(20, {
                    min: 0,
                    max: 90
                })
            },
            {
                name: 'iPhone 16',
                data: generateData(20, {
                    min: 0,
                    max: 90
                })
            },
            {
                name: 'iPhone 16 Pro',
                data: generateData(20, {
                    min: 0,
                    max: 90
                })
            },
            {
                name: 'iPhone 16 Pro Max',
                data: generateData(20, {
                    min: 0,
                    max: 90
                })
            }
        ],

        xaxis: {
            type: 'category',
        },
        grid: {
            borderColor: [ins('border-color')]
        }
    })
})
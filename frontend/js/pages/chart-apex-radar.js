/**
 * Template Name: UBold - Admin & Dashboard Template
 * By (Author): Coderthemes
 * Module/App (File Name): Chart Apex Radar
 */
import { CustomApexChart , ins} from '../app'
//
// BASIC RADAR CHART
//
new CustomApexChart({
    selector: '#basic-radar',
    options: () => ({
        chart: {
            height: 350,
            type: 'radar',
            toolbar: {show: false}
        },
        series: [{
            name: 'Series 1',
            data: [85, 70, 60, 90, 75, 65],
        }],
        labels: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'SQL'],
        colors: [ins('primary')],
    })
})


//
// RADAR WITH POLYGON-FILL
//
new CustomApexChart({
    selector: '#radar-polygon',
    options: () => ({
        chart: {
            height: 350,
            type: 'radar',
        },
        series: [{
            name: 'Activity Level',
            data: [80, 60, 75, 90, 50, 70, 65]
        }],
        colors: [ins('secondary')],
        labels: ['Cardio',
            'Strength Training',
            'Flexibility',
            'Endurance',
            'Balance',
            'HIIT',
            'Mobility'],
        plotOptions: {
            radar: {
                size: 120,
            }
        },
        markers: {
            size: 4,
            colors: [ins('danger')],
            strokeWidth: 2,
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val + ' pts';
                }
            }
        },
        yaxis: {
            tickAmount: 7,
            labels: {
                formatter: function (val, i) {
                    return i % 2 === 0 ? val : '';
                }
            }
        }
    })
})


//
// RADAR – MULTIPLE SERIES
//
const multiSeriesRadarChart = new CustomApexChart({
    selector: '#radar-multiple-series',
    options: () => ({
        chart: {
            height: 350,
            type: 'radar',
            toolbar: {show: false}
        },
        series: [
            {
                name: 'Marketing',
                data: [85, 70, 65, 90, 60, 75]
            },
            {
                name: 'Sales',
                data: [60, 80, 75, 55, 95, 70]
            },
            {
                name: 'IT',
                data: [78, 65, 80, 40, 60, 85]
            }
        ],
        colors: [ins('primary'), ins('secondary'), ins('purple')],
        stroke: {
            width: 0
        },
        plotOptions: {
            radar: {
                size: 120,
            }
        },
        fill: {
            opacity: 0.4
        },
        markers: {
            size: 0
        },
        legend: {
            offsetY: 5,
        },
        labels: [
            'Customer Satisfaction',
            'Revenue Growth',
            'Efficiency',
            'Innovation',
            'Support Quality',
            'Compliance']
    })
})


function update() {

    function randomSeries() {
        const arr = []
        for (let i = 0; i < 6; i++) {
            arr.push(Math.floor(Math.random() * 100))
        }

        return arr
    }


    multiSeriesRadarChart.chart.updateSeries([
        {
            name: 'Marketing',
            data: randomSeries(),
        },
        {
            name: 'Sales',
            data: randomSeries(),
        },
        {
            name: 'IT',
            data: randomSeries(),
        }
    ])
}

/**
 * Template Name: UBold - Admin & Dashboard Template
 * By (Author): Coderthemes
 * Module/App (File Name): ECommerce Reviews
 */
import { CustomApexChart, ins } from '../app'
new CustomApexChart({
    selector: '#reviews-30days-chart',
    options: () => ({
        chart: {
            type: 'area',
            height: 185,
            toolbar: {show: false}
        },
        grid: {
            padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            }
        },
        series: [{
            name: 'Reviews',
            data: [5, 8, 6, 7, 10, 12, 9, 14, 11, 15, 17, 19, 14, 13, 16, 18, 22, 20, 19, 17, 15, 18, 20, 23, 21, 22, 24, 26, 25, 28]
        }],
        xaxis: {
            categories: Array.from({length: 30}, (_, i) => `${i + 1}`),
            labels: {
                rotate: -45,
                style: {
                    fontSize: '10px'
                }
            }
        },
        colors: [ins('secondary')],
        fill: {
            opacity: 0.3,
        },
        stroke: {
            curve: 'smooth',
            width: 2
        },
        dataLabels: {
            enabled: false
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return `${val} Reviews`;
                }
            }
        }
    })
})

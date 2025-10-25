/**
 * Template Name: UBold - Admin & Dashboard Template
 * By (Author): Coderthemes
 * Module/App (File Name): Chart Apex Funnel
 */
import { CustomApexChart , ins} from '../app'

new CustomApexChart({
    selector: '#basic-funnel',
    options: () => ({
        series: [
            {
                name: "E-commerce Sales",
                data: [2000, 1700, 1250, 980, 750, 500, 300, 120],
            },
        ],
        chart: {
            type: 'bar',
            height: 350,
            dropShadow: {
                enabled: true,
            },
            toolbar: {
                show: false,
            },
        },
        colors: [ins('primary')],
        plotOptions: {
            bar: {
                borderRadius: 0,
                horizontal: true,
                barHeight: '80%',
                isFunnel: true,
            },
        },
        dataLabels: {
            enabled: true,
            formatter: function (val, opt) {
                return opt.w.globals.labels[opt.dataPointIndex] + ':  ' + val
            },
            dropShadow: {
                enabled: true,
            },
        },
        xaxis: {
            categories: [
                'Visited Website',
                'Viewed Product',
                'Added to Cart',
                'Initiated Checkout',
                'Entered Info',
                'Payment Started',
                'Payment Completed',
                'Order Delivered',
            ],
        },
        legend: {
            show: false,
        },
        grid: {
            padding: {top: -20, bottom: 0}
        }
    })
})


new CustomApexChart({
    selector: '#pyramid-funnel',
    options: () => ({
        series: [
            {
                name: "",
                data: [100, 300, 500, 720, 850, 970, 1150, 1500],
            },
        ],
        chart: {
            type: 'bar',
            height: 350,
            dropShadow: {
                enabled: true,
            },
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                borderRadius: 0,
                horizontal: true,
                distributed: true,
                barHeight: '80%',
                isFunnel: true,
            },
        },
        colors: [
            ins('light'),
            ins('gray'),
            ins('danger'),
            ins('warning'),
            ins('success'),
            ins('info'),
            ins('purple'),
            ins('secondary'),
        ],
        dataLabels: {
            enabled: true,
            formatter: function (val, opt) {
                return opt.w.globals.labels[opt.dataPointIndex]
            },
            dropShadow: {
                enabled: true,
            },
        },
        xaxis: {
            categories: [
                'Converted Customers',
                'Qualified Leads',
                'Demo Booked',
                'Webinar Attended',
                'Email Clicked',
                'Email Opened',
                'Ad Clicked',
                'Impressions'
            ],
        },
        legend: {
            show: false,
        },
        grid: {
            padding: {top: -20, bottom: 0}
        }
    })
})
/**
 * Template Name: UBold - Admin & Dashboard Template
 * By (Author): Coderthemes
 * Module/App (File Name): ECommerce Seller Details
 */
import { CustomApexChart, ins } from '../app'
// Function to generate random data
function generateRandomData(length, min, max) {
    return Array.from({length}, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

new CustomApexChart({
    selector: '#seller-revenue',
    options: () => ({
        series: [
            {
                name: "Orders",
                type: "area",
                data: generateRandomData(12, 40, 100), // Random Orders: 40–100
            },
            {
                name: "Earnings",
                type: "bar",
                data: generateRandomData(12, 70, 150).map(x => (x * 1.1).toFixed(2)), // Random Earnings: $70–$150 with 2 decimals
            },
            {
                name: "Refunds",
                type: "line",
                data: generateRandomData(12, 3, 12), // Random Refunds: 3–12
            },
        ],
        chart: {
            height: 370,
            type: "line",
            toolbar: {
                show: false,
            },
        },
        stroke: {
            curve: "straight",
            dashArray: [0, 0, 8],
            width: [2, 0, 2.2],
        },
        fill: {
            opacity: [0.1, 0.9, 1],
        },
        markers: {
            size: [0, 0, 0],
            strokeWidth: 2,
            hover: {
                size: 4,
            },
        },
        xaxis: {
            categories: [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
            ],
            axisTicks: {
                show: false,
            },
            axisBorder: {
                show: false,
            },
        },
        grid: {
            show: true,
            xaxis: {
                lines: {
                    show: false,
                },
            },
            yaxis: {
                lines: {
                    show: true,
                },
            },
            padding: {
                top: 0,
                right: 0,
                bottom: 10,
                left: 0,
            },
        },
        legend: {
            show: true,
            horizontalAlign: "center",
            offsetX: 0,
            offsetY: 5,
            markers: {
                width: 9,
                height: 9,
                radius: 6,
            },
            itemMargin: {
                horizontal: 10,
                vertical: 0,
            },
        },
        plotOptions: {
            bar: {
                columnWidth: "30%",
                barHeight: "70%",
                borderRadius: 5
            },
        },
        colors: [ins('secondary'), ins('chart-primary'), ins('warning')],
        tooltip: {
            shared: true,
            y: [
                {
                    formatter: function (y) {
                        if (typeof y !== "undefined") {
                            return y.toFixed(0) + " Sales";
                        }
                        return y;
                    },
                },
                {
                    formatter: function (y) {
                        if (typeof y !== "undefined") {
                            return "$" + y.toFixed(2) + "k";
                        }
                        return y;
                    },
                },
                {
                    formatter: function (y) {
                        if (typeof y !== "undefined") {
                            return y.toFixed(0) + " Sales";
                        }
                        return y;
                    },
                },
            ],
        },
    })
})
/**
 * Template Name: UBold - Admin & Dashboard Template
 * By (Author): Coderthemes
 * Module/App (File Name): Dashboard v.2
 */
import { CustomApexChart, ins } from "../app";

function generateRandomData(count, min, max) {
    return Array.from({length: count}, () =>
        Math.floor(Math.random() * (max - min + 1)) + min
    );
}

function generateSessionAndPageViewData(count) {
    const sessions = generateRandomData(count, 250, 450);
    const pageViews = sessions.map(session =>
        Math.floor(session * (2 + Math.random() * 0.1)) // Page Views are 2x to 2.5x of Sessions
    );
    return {sessions, pageViews};
}

const {sessions, pageViews} = generateSessionAndPageViewData(19);

new CustomApexChart({
    selector: '#project-overview-chart',
    options: () => ({
        chart: {
            height: 330,
            type: 'area',
            toolbar: {show: false}
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            width: 2,
            curve: 'smooth'
        },
        colors: [ins('chart-primary'), ins('secondary')],
        series: [
            {
                name: 'Sessions',
                data: sessions
            },
            {
                name: 'Page Views',
                data: pageViews
            }
        ],
        legend: {
            offsetY: 5,
        },
        xaxis: {
            categories: ["", "8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM",
                "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM",
                "9 PM", "10 PM", "11 PM", "12 AM", ""],
            axisBorder: {show: false},
            axisTicks: {show: false},
            tickAmount: 6,
            labels: {
                style: {
                    fontSize: "12px"
                }
            }
        },
        tooltip: {
            shared: true,
            y: {
                formatter: function (val, {seriesIndex}) {
                    if (seriesIndex === 0) {
                        return val + " Sessions";
                    } else if (seriesIndex === 1) {
                        return val + " Page Views";
                    }
                    return val;
                }
            }
        },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0.2,
                stops: [15, 120, 100]
            }
        },
        grid: {
            borderColor: [ins('border-color')],
            padding: {
                bottom: 0
            }
        }
    })
})

function generateData(baseval, count, yrange) {
    let i = 0;
    const series = [];
    while (i < count) {
        const x = Math.floor(Math.random() * (750 - 1 + 1)) + 1;
        const y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
        const z = Math.floor(Math.random() * (75 - 15 + 1)) + 15;

        series.push([x, y, z]);
        baseval += 86400000;
        i++;
    }
    return series;
}

new CustomApexChart({
    selector: '#task-progress-chart',
    options: () => ({
        chart: {
            height: 330, // Increased height for spacing
            type: 'bubble',
            toolbar: {
                show: false
            }
        },
        dataLabels: {
            enabled: false
        },
        series: [{
            name: 'Bubble 1',
            data: generateData(new Date('11 Feb 2017 GMT').getTime(), 10, {
                min: 10,
                max: 60
            })
        },
            {
                name: 'Bubble 2',
                data: generateData(new Date('11 Feb 2017 GMT').getTime(), 10, {
                    min: 10,
                    max: 60
                })
            },
            {
                name: 'Bubble 3',
                data: generateData(new Date('11 Feb 2017 GMT').getTime(), 10, {
                    min: 10,
                    max: 60
                })
            }
        ],
        fill: {
            opacity: 0.8,
            gradient: {
                enabled: false
            }
        },
        colors: [ins('chart-primary'), ins('secondary'), ins('danger')],
        xaxis: {
            tickAmount: 12,
            type: 'category',
        },
        yaxis: {
            max: 70
        },
        grid: {
            borderColor: [ins('border-color')],
            padding: {
                top: -20,
                right: 0,
                bottom: -5,
                left: 10
            }
        },
        legend: {
            offsetY: 7,
        }
    })
})

document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector('#chat-container');
    if (container && container.SimpleBar) {
        container.SimpleBar.getScrollElement().scrollTop = container.SimpleBar.getScrollElement().scrollHeight;
    } else {
        // Fallback if not using custom SimpleBar instance
        const scrollElement = container.querySelector('.simplebar-content-wrapper');
        if (scrollElement) {
            scrollElement.scrollTop = scrollElement.scrollHeight;
        }
    }
});
/**
 * Template Name: UBold - Admin & Dashboard Template
 * By (Author): Coderthemes
 * Module/App (File Name): Chart Apex Treemap
 */
import { CustomApexChart , ins} from '../app'
//
// BASIC TREEMAP
//
new CustomApexChart({
    selector: '#basic-treemap',
    options: () => ({
        series: [{
            data: [
                {x: 'Electronics', y: 420},
                {x: 'Clothing', y: 310},
                {x: 'Home & Kitchen', y: 280},
                {x: 'Books', y: 130},
                {x: 'Toys & Games', y: 160},
                {x: 'Beauty & Health', y: 90},
                {x: 'Groceries', y: 150},
                {x: 'Furniture', y: 110},
                {x: 'Automotive', y: 95},
                {x: 'Garden Supplies', y: 85},
                {x: 'Pet Supplies', y: 60},
                {x: 'Sports Equipment', y: 78},
                {x: 'Office Supplies', y: 72}
            ]
        }],
        legend: {
            show: false
        },
        chart: {
            height: 350,
            type: 'treemap',
            toolbar: {
                show: false
            }
        },
        colors: [ins('primary')],
        title: {
            text: 'Sales by Product Category',
            align: 'center',
            offsetY: 5,
            style: {
                fontSize: '14px',
                fontWeight: 500
            }
        },
        grid: {
            padding: {right: 10}
        }
    })
})


//
// TREEMAP MULTIPLE SERIES
//
new CustomApexChart({
    selector: '#multiple-treemap',
    options: () => ({
        series: [
            {
                name: 'Online',
                data: [
                    {x: 'Amazon', y: 120},
                    {x: 'eBay', y: 80},
                    {x: 'Shopify', y: 60}
                ]
            },
            {
                name: 'In-Store',
                data: [
                    {x: 'Walmart', y: 150},
                    {x: 'Target', y: 110},
                    {x: 'Best Buy', y: 95},
                    {x: 'Costco', y: 130},
                    {x: 'Kroger', y: 100},
                    {x: 'CVS', y: 85}
                ]
            }
        ],
        legend: {
            show: false
        },
        chart: {
            height: 350,
            type: 'treemap',
            toolbar: {show: false}
        },
        colors: [ins('secondary'), ins('info')],
        title: {
            text: 'Revenue by Division',
            align: 'center',
            offsetY: 5,
            style: {
                fontSize: '14px',
                fontWeight: 500
            }
        },
        grid: {
            padding: {right: 10}
        }
    })
})


//
// DISTRIBUTED TREEMAP
//
new CustomApexChart({
    selector: '#distributed-treemap',
    options: () => ({
        series: [{
            data: [
                {x: 'Team Alpha', y: 91},
                {x: 'Team Beta', y: 78},
                {x: 'Team Gamma', y: 84},
                {x: 'Team Delta', y: 62},
                {x: 'Team Epsilon', y: 73},
                {x: 'Team Zeta', y: 55},
                {x: 'Team Eta', y: 68},
                {x: 'Team Theta', y: 47},
                {x: 'Team Iota', y: 59},
                {x: 'Team Kappa', y: 81},
                {x: 'Team Lambda', y: 39},
                {x: 'Team Mu', y: 44},
                {x: 'Team Nu', y: 53}
            ]
        }],
        legend: {
            show: false
        },
        chart: {
            height: 350,
            type: 'treemap',
            toolbar: {show: false}
        },
        title: {
            text: 'Distributed Treemap - Team Performance Scores',
            align: 'center',
            offsetY: 5,
            style: {
                fontSize: '14px',
                fontWeight: 500
            }
        },
        colors: [ins('success'), ins('warning'), ins('danger'), ins('info'), ins('secondary'), ins('primary'), ins('purple'), ins('pink'), ins('dark'), ins('gray')],
        plotOptions: {
            treemap: {
                distributed: true,
                enableShades: false
            }
        },
        grid: {
            padding: {right: 10}
        }
    })
})


//
// COLOR RANGE TREEMAP
//
new CustomApexChart({
    selector: '#color-range-treemap',
    options: () => ({
        series: [{
            data: [
                {x: 'Sales', y: 3.2},
                {x: 'Marketing', y: -1.1},
                {x: 'R&D', y: 4.5},
                {x: 'Support', y: 0.7},
                {x: 'HR', y: -0.8},
                {x: 'Finance', y: 2.3},
                {x: 'Operations', y: -2.5},
                {x: 'Legal', y: 0.1},
                {x: 'IT', y: -1.7},
                {x: 'Logistics', y: 1.9},
                {x: 'Security', y: -3.3},
                {x: 'Procurement', y: 2.6},
                {x: 'Admin', y: 0.5}
            ]
        }],
        legend: {
            show: false
        },
        chart: {
            height: 350,
            type: 'treemap',
            toolbar: {show: false}
        },
        title: {
            text: 'Departmental Profit/Loss (%)',
            align: 'center',
            offsetY: 5,
            style: {
                fontSize: '14px',
                fontWeight: 500
            }
        },
        dataLabels: {
            enabled: true,
            style: {
                fontSize: '12px',
            },
            formatter: function (text, op) {
                return [text, op.value + '%']
            },
            offsetY: -4
        },
        plotOptions: {
            treemap: {
                enableShades: true,
                shadeIntensity: 0.5,
                reverseNegativeShade: true,
                colorScale: {
                    ranges: [
                        {
                            from: -10,
                            to: 0,
                            color: ins('danger') // loss
                        },
                        {
                            from: 0.001,
                            to: 10,
                            color: ins('success') // gain
                        }
                    ]
                }
            }
        }
    })
})
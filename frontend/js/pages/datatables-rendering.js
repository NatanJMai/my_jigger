/**
 * Template Name: UBold - Admin & Dashboard Template
 * By (Author): Coderthemes
 * Module/App (File Name): Datatables Rendering
 */

import DataTable from "datatables.net";
import 'datatables.net-bs5'
import 'datatables.net-responsive'
import 'datatables.net-responsive-bs5'

document.addEventListener('DOMContentLoaded', function () {
    const tableElement = document.getElementById('datatable-rendering');

    if (tableElement) {

        const cityToCountryCode = {
            "Gujarat": "in",
            "Tokyo": "jp",
            "San Francisco": "us",
            "New York": "us",
            "London": "gb",
            "Sydney": "au",
            "Argentina": "ar"
        };

        new DataTable(tableElement, {
            language: {
                paginate: {
                    first: '<i class="ti ti-chevrons-left"></i>',
                    previous: '<i class="ti ti-chevron-left"></i>',
                    next: '<i class="ti ti-chevron-right"></i>',
                    last: '<i class="ti ti-chevrons-right"></i>'
                }
            },
            ajax: '/data/datatables-rendering.json',
            columns: [
                {
                    data: 'name'
                },
                {
                    data: 'position',
                    render: function (data, type) {
                        if (type === 'display') {
                            let link = 'https://datatables.net';

                            if (data[0] < 'H') {
                                link = 'https://cloudtables.com';
                            } else if (data[0] < 'S') {
                                link = 'https://editor.datatables.net';
                            }

                            return '<a href="' + link + '">' + data + '</a>';
                        }

                        return data;
                    }
                },
                {
                    data: 'office',
                    className: 'f32', // used by world-flags-sprite library
                    render: function (data, type) {
                        if (type === 'display') {
                            const flagMap = {
                                'Argentina': 'ar',
                                'Gujarat': 'in',
                                'Germany': 'de',
                                'London': 'gb',
                                'New York': 'us',
                                'San Francisco': 'us',
                                'Sydney': 'au',
                                'Tokyo': 'jp'
                            };

                            const countryCode = flagMap[data] || '';
                            return `<span class="flag ${countryCode}">
                                        <img class="avatar-xs rounded me-2" src="/images/flags/${countryCode}.svg" alt="${data}" />
                                    </span> ${data}`;
                        }

                        return data;
                    }
                },
                {
                    data: 'extn',
                    render: function (data, type, row, meta) {
                        return type === 'display'
                            ? `<div class="progress" role="progressbar" aria-label="Basic example" aria-valuenow="${data}" aria-valuemin="0" aria-valuemax="9999" style="height:8px">
                                  <div class="progress-bar" style="width: ${(data / 9999) * 100}%"></div>
                            </div>`
                            : data;
                    }
                },
                {
                    data: 'start_date'
                },
                {
                    data: 'salary',
                    render: function (data, type) {
                        var number = DataTable.render
                            .number(',', '.', 2, '$')
                            .display(data);

                        if (type === 'display') {
                            let color = 'green';
                            if (data < 250000) {
                                color = 'red';
                            } else if (data < 500000) {
                                color = 'orange';
                            }

                            return `<span style="color:${color}">${number}</span>`;
                        }

                        return number;
                    }
                }
            ]
        });
    }
})
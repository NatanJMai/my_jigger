/**
 * Template Name: UBold - Admin & Dashboard Template
 * By (Author): Coderthemes
 * Module/App (File Name): Datatables Add Rows
 */

import DataTable from 'datatables.net'
import 'datatables.net-bs5'
import 'datatables.net-responsive'
import 'datatables.net-responsive-bs5'

document.addEventListener('DOMContentLoaded', () => {
    let counter = 1;

    const tableElement = document.getElementById('add-rows-data');
    if (tableElement) {
        const table = new DataTable('#add-rows-data', {
            dom: "<'d-md-flex justify-content-between align-items-center my-2'<'btn-toolbar'<'addRowBtn me-3'>><'dropdown'B>f>" +
                "<'row'<'col-sm-12'tr>>" +
                "<'d-md-flex justify-content-between align-items-center mt-2'ip>",
            language: {
                paginate: {
                    first: '<i class="ti ti-chevrons-left"></i>',
                    previous: '<i class="ti ti-chevron-left"></i>',
                    next: '<i class="ti ti-chevron-right"></i>',
                    last: '<i class="ti ti-chevrons-right"></i>'
                }
            },
            columns: [
                {title: 'Company'},
                {title: 'Symbol'},
                {title: 'Price'},
                {title: 'Change'},
                {title: 'Volume'},
                {title: 'Market Cap'},
                {title: 'Rating'},
                {title: 'Status'}
            ]
        });

        // Add a custom button (after table renders)
        const btnContainer = document.querySelector('.addRowBtn');
        if (btnContainer) {
            const btn = document.createElement('button');
            btn.id = 'addRow';
            btn.className = 'btn btn-primary btn-sm';
            btn.textContent = 'Add Row';
            btnContainer.appendChild(btn);

            btn.addEventListener('click', () => {
                table.row.add([
                    `New Company ${counter}`,
                    `SYM${counter}`,
                    `$${(Math.random() * 1000 + 1000).toFixed(2)}`,
                    `${Math.random() > 0.5 ? '+' : '-'}${(Math.random() * 2).toFixed(2)}%`,
                    Math.floor(Math.random() * 1000000).toLocaleString(),
                    `$${(Math.random() * 100).toFixed(2)}B`,
                    `${(Math.random() * 5).toFixed(1)} ★`,
                    `<span class="badge badge-label badge-soft-${Math.random() > 0.5 ? 'success' : 'danger'}">${Math.random() > 0.5 ? 'Bullish' : 'Bearish'}</span>`
                ]).draw(false);
                counter++;
            });
        }
    }
});
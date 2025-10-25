/**
 * Template Name: UBold - Admin & Dashboard Template
 * By (Author): Coderthemes
 * Module/App (File Name): Datatables Ajax
 */
import DataTable from 'datatables.net';
import 'datatables.net-bs5'
import 'datatables.net-responsive'
import 'datatables.net-responsive-bs5'

document.addEventListener('DOMContentLoaded', () => {
    const tableElement = document.getElementById('datatables-ajax')
    if (tableElement) {
        new DataTable(tableElement, {
            ajax: '/data/datatables.json',
            processing: true,
            columns: [
                {data: 'company'},
                {data: 'symbol'},
                {data: 'price'},
                {data: 'change'},
                {data: 'volume'},
                {data: 'market_cap'},
                {data: 'rating'},
                {
                    data: 'status',
                    render: (data, type, row) => {
                        const isBullish = data === 'Bullish';
                        return `<span class="badge badge-label badge-soft-${isBullish ? 'success' : 'danger'}">${data}</span>`;
                    }
                }
            ],
            language: {
                paginate: {
                    first: '<i class="ti ti-chevrons-left"></i>',
                    previous: '<i class="ti ti-chevron-left"></i>',
                    next: '<i class="ti ti-chevron-right"></i>',
                    last: '<i class="ti ti-chevrons-right"></i>'
                },
                lengthMenu: '_MENU_ Companies per page',
                info: 'Showing <span class="fw-semibold">_START_</span> to <span class="fw-semibold">_END_</span> of <span class="fw-semibold">_TOTAL_</span> Companies'
            }
        });
    }
});


/**
 * Template Name: UBold - Admin & Dashboard Template
 * By (Author): Coderthemes
 * Module/App (File Name): Datatables Child Rows
 */

// Formatting function for row details - modify as you need
import DataTable from "datatables.net";
import 'datatables.net-bs5'
import 'datatables.net-responsive'
import 'datatables.net-select-bs5'

function format(d) {
    // `d` is the original data object for the row
    return (
        '<div class="row align-items-center">' +
        '<div class="col-md-4">' +
        '<h5 class="fs-base mb-1">Rating:</h5>' +
        '<div>' + d.rating + '</div>' +
        '</div>' +

        '<div class="col-md-4">' +
        '<h5 class="fs-base mb-1">Status:</h5>' +
        `<span class="badge badge-label ${d.status === 'Bullish' ? 'badge-soft-success' : 'badge-soft-danger'}">${d.status}</span>` +
        '</div>' +

        '<div class="col-md-4">' +
        '<h5 class="fs-base mb-1">Extra info:</h5>' +
        '<div>And any further details here (images etc)...</div>' +
        '</div>' +
        '</div>'
    );
}

document.addEventListener('DOMContentLoaded', () => {
    const tableElement = document.getElementById('child-rows-data');
    if (tableElement) {
        const table = new DataTable(tableElement, {
            ajax: '/data/datatables.json',  // path to your JSON file
            columns: [
                {
                    className: 'dt-control dt-child-rows-btn',
                    orderable: false,
                    data: null,
                    defaultContent: '<i class="ti ti-square-rounded-plus-filled text-primary align-middle fs-22"></i>'
                },
                {data: 'company'},
                {data: 'symbol'},
                {data: 'price'},
                {data: 'change'},
                {data: 'volume'},
                {data: 'market_cap'}
            ],
            order: [[1, 'asc']],
            language: {
                paginate: {
                    first: '<i class="ti ti-chevrons-left"></i>',
                    previous: '<i class="ti ti-chevron-left"></i>',
                    next: '<i class="ti ti-chevron-right"></i>',
                    last: '<i class="ti ti-chevrons-right"></i>'
                }
            }
        });

        // Add event listener for opening and closing details
        table.on('click', 'td.dt-control', function (e) {
            let tr = e.target.closest('tr');
            let row = table.row(tr);

            if (row.child.isShown()) {
                // This row is already open - close it
                row.child.hide();
            } else {
                // Open this row
                row.child(format(row.data())).show();
            }
        });
    }
})
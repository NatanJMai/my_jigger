/**
 * Template Name: UBold - Admin & Dashboard Template
 * By (Author): Coderthemes
 * Module/App (File Name): Datatables Range Search
 */
import DataTable from "datatables.net";
import 'datatables.net-bs5'
import 'datatables.net-responsive'
import 'datatables.net-responsive-bs5'

document.addEventListener('DOMContentLoaded', function () {
    const tableElement = document.getElementById('range-search-data');

    if (tableElement) {
        const table = new DataTable(tableElement, {
            dom: "<'d-md-flex justify-content-between align-items-center my-2'<'filter-range me-2'>f>" +
                "rt" +
                "<'d-md-flex justify-content-between align-items-center mt-2'ip>",
            language: {
                paginate: {
                    first: '<i class="ti ti-chevrons-left"></i>',
                    previous: '<i class="ti ti-chevron-left"></i>',
                    next: '<i class="ti ti-chevron-right"></i>',
                    last: '<i class="ti ti-chevrons-right"></i>'
                }
            }
        });

        const filterContainer = document.querySelector('.filter-range');

        if (filterContainer) {
            // Add custom range filter inputs
            filterContainer.innerHTML = `
            <div class="d-flex align-items-center gap-2 my-2">
                <label class="fw-semibold">Price: </label>
                <input type="text" class="form-control form-control-sm" placeholder="Min" id="min">
                <input type="text" class="form-control form-control-sm" placeholder="Max" id="max">
            </div>`;

            const minInput = document.getElementById('min');
            const maxInput = document.getElementById('max');

            // Add range-based filtering logic
            table.search.fixed('range', function (searchStr, data) {
                const min = parseFloat(minInput.value) || NaN;
                const max = parseFloat(maxInput.value) || NaN;

                // Get and normalize price from column index 2
                const priceStr = (data[2] || '').replace(/[^0-9.]/g, '');
                const price = parseFloat(priceStr) || 0;

                return (
                    (isNaN(min) && isNaN(max)) ||
                    (isNaN(min) && price <= max) ||
                    (min <= price && isNaN(max)) ||
                    (min <= price && price <= max)
                );
            });

            // Attach input listeners to trigger table redraw
            minInput.addEventListener('input', () => table.draw());
            maxInput.addEventListener('input', () => table.draw());
        }
    }
});
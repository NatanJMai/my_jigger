/**
 * Template Name: UBold - Admin & Dashboard Template
 * By (Author): Coderthemes
 * Module/App (File Name): Datatables Show Hide Columns
 */
import DataTable from "datatables.net";
import 'datatables.net-bs5'
import 'datatables.net-responsive'
import 'datatables.net-responsive-bs5'

document.addEventListener('DOMContentLoaded', function () {
    const tableElement = document.getElementById('show-hide-column');
    if (tableElement) {
        const table = new DataTable(tableElement, {
            responsive: true,
            dom: "<'d-md-flex justify-content-between align-items-center mt-2 mb-3'<'columnToggleWrapper'B>f>" +
                "rt" +
                "<'d-md-flex justify-content-between align-items-center mt-2'lp>",
            language: {
                paginate: {
                    first: '<i class="ti ti-chevrons-left"></i>',
                    previous: '<i class="ti ti-chevron-left"></i>',
                    next: '<i class="ti ti-chevron-right"></i>',
                    last: '<i class="ti ti-chevrons-right"></i>'
                }
            }
        });

        // Define columns and labels
        const columnLabels = [
            "Company", "Symbol", "Price", "Change", "Volume", "Market Cap", "Rating", "Status"
        ];

        // Create dropdown with toggles dynamically
        const columnToggleWrapper = document.querySelector('.columnToggleWrapper');

        if (columnToggleWrapper) {
            const dropdown = document.createElement('div');
            dropdown.className = 'dropdown';

            dropdown.innerHTML = `
        <button class="btn btn-sm btn-secondary" type="button" data-bs-toggle="dropdown" data-bs-auto-close="outside">
            Show/Hide Columns
        </button>
        <ul class="dropdown-menu" id="columnToggleMenu">
            ${columnLabels.map((label, index) => `
                <li class="dropdown-item">
                    <div class="form-check">
                        <input class="form-check-input form-check-input-light fs-14 mt-0 toggle-vis" 
                               type="checkbox" data-column="${index}" id="colToggle${index}" checked>
                        <label class="form-check-label fw-medium" for="colToggle${index}">
                            ${label}
                        </label>
                    </div>
                </li>
            `).join('')}
        </ul>
    `;

            columnToggleWrapper.appendChild(dropdown);

            // Handle visibility toggle
            document.getElementById('columnToggleMenu').addEventListener('change', function (e) {
                if (e.target.classList.contains('toggle-vis')) {
                    const colIndex = parseInt(e.target.dataset.column, 10);
                    const column = table.column(colIndex);
                    column.visible(e.target.checked);
                }
            });
        }
    }
});
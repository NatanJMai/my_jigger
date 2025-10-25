/**
 * Template Name: UBold - Admin & Dashboard Template
 * By (Author): Coderthemes
 * Module/App (File Name): Datatables Scroll
 */
import DataTable from "datatables.net";
import 'datatables.net-bs5'
import 'datatables.net-responsive'
import 'datatables.net-responsive-bs5'

document.addEventListener('DOMContentLoaded', function () {
    const tableElement = document.getElementById('vertical-scroll');
    if (tableElement) {
        new DataTable(tableElement, {
            paging: false,              // Disable pagination
            scrollCollapse: true,       // Allow table to collapse
            scrollY: '250px',           // Vertical scrolling
        });

        new DataTable('#horizontal-scroll', {
            scrollX: true,
            language: {
                paginate: {
                    first: '<i class="ti ti-chevrons-left"></i>',   // Tabler First
                    previous: '<i class="ti ti-chevron-left"></i>', // Tabler Prev
                    next: '<i class="ti ti-chevron-right"></i>',    // Tabler Next
                    last: '<i class="ti ti-chevrons-right"></i>'    // Tabler Last
                },
                lengthMenu: '_MENU_ Companies per page', // Change text to "Companies"
                info: 'Showing <span class="fw-semibold">_START_ </span> to <span class="fw-semibold">_END_</span> of <span class="fw-semibold">_TOTAL_</span> Companies' // Customize the "Showing" text
            }
        });
    }
})
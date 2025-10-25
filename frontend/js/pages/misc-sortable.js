/**
 * Template Name: UBold - Admin & Dashboard Template
 * By (Author): Coderthemes
 * Module/App (File Name): Misc Sortable
 */
import Sortable from "sortablejs";

// Sortable
function initNestedSortables(selector, options) {
    const containers = document.querySelectorAll(selector);
    if (containers.length) {
        containers.forEach(container => {
            new Sortable(container, options);
        });
    }
}

initNestedSortables('.nested-sortable', {
    group: 'nested',
    ghostClass: 'sortable-item-ghost',
    animation: 150,
    fallbackOnBody: true,
    swapThreshold: 0.65,
    onStart: function (evt) {
        evt.item.classList.add('sortable-drag');
    },
    onEnd: function (evt) {
        evt.item.classList.remove('sortable-drag');
    }
});

initNestedSortables('.nested-sortable-handle', {
    handle: '.sort-handle',
    ghostClass: 'sortable-item-ghost',
    group: 'nested',
    animation: 150,
    fallbackOnBody: true,
    swapThreshold: 0.65
});

/**
 * Template Name: UBold - Admin & Dashboard Template
 * By (Author): Coderthemes
 * Module/App (File Name): Form Choice JS
 */

import Choices from "choices.js";

document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll('[data-choices]');
    if (elements && elements.length > 0) {
        elements.forEach(item => {
            const config = {
                placeholderValue: item.hasAttribute("data-choices-groups") ? "This is a placeholder set in the config" : undefined,
                searchEnabled: item.hasAttribute("data-choices-search-true"),
                removeItemButton: item.hasAttribute("data-choices-removeItem") || item.hasAttribute("data-choices-multiple-remove"),
                shouldSort: !item.hasAttribute("data-choices-sorting-false"),
                maxItemCount: item.getAttribute("data-choices-limit") || undefined,
                duplicateItemsAllowed: !item.hasAttribute("data-choices-text-unique-true"),
                addItems: !item.hasAttribute("data-choices-text-disabled-true")
            };
            const instance = new Choices(item, config);
            if (item.hasAttribute("data-choices-text-disabled-true")) instance.disable();
        });
    }
})

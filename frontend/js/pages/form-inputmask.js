/**
 * Template Name: UBold - Admin & Dashboard Template
 * By (Author): Coderthemes
 * Module/App (File Name): Form Inputmask
 */
import Inputmask from "inputmask";

document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('[data-toggle="input-mask"]')
    if (elements && elements.length > 0) {
        elements.forEach(e => {
            const maskFormat = e.getAttribute('data-mask-format').replace(/0/g, '9');
            const im = new Inputmask(maskFormat);
            im.mask(e);
        })
    }
});
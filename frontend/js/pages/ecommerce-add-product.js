/**
 * Template Name: UBold - Admin & Dashboard Template
 * By (Author): Coderthemes
 * Module/App (File Name): Add Ecommerce Product
 */
import Quill from 'quill'

if (typeof Quill != 'undefined') {

    // Import Quill's built-in icons
    const icons = Quill.import('ui/icons');

    // Replace Quill's built-in toolbar icons with Tabler icons
    icons['bold'] = '<i class="ti ti-bold fs-lg"></i>'
    icons['italic'] = '<i class="ti ti-italic fs-lg"></i>'
    icons['underline'] = '<i class="ti ti-underline fs-lg"></i>'
    icons['strike'] = '<i class="ti ti-strikethrough fs-lg"></i>'
    icons['list'] = '<i class="ti ti-list fs-lg"></i>'
    icons['bullet'] = '<i class="ti ti-list-ul fs-lg"></i>'
    icons['link'] = '<i class="ti ti-link fs-lg"></i>'
    icons['image'] = '<i class="ti ti-photo fs-lg"></i>'
    icons['code-block'] = '<i class="ti ti-code fs-lg"></i>'
    icons['background'] = '<i class="ti ti-background fs-lg"></i>'
    icons['blockquote'] = '<i class="ti ti-blockquote fs-lg"></i>'


    // Quill editor initialization function
    function initQuillEditors() {
        // Quill editor
        const snowEditor = document.getElementById('snow-editor')
        if (snowEditor && !snowEditor.dataset.quillInitialized) {
            new Quill(snowEditor, {
                theme: 'snow',
                modules: {
                    'toolbar': [
                        ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block', {'list': 'bullet'}, 'link', 'image']
                    ]
                }
            });
            snowEditor.dataset.quillInitialized = 'true';
        }

        // Bubble theme
        const bubbleEditor = document.getElementById('bubble-editor')
        if (bubbleEditor && !bubbleEditor.dataset.quillInitialized) {
            new Quill('#bubble-editor', {
                theme: 'bubble'
            });
            bubbleEditor.dataset.quillInitialized = 'true';
        }
    }

    // Initialize Quill editors on both DOMContentLoaded and turbo:load
    document.addEventListener("DOMContentLoaded", initQuillEditors);
    document.addEventListener("turbo:load", initQuillEditors);
}


class FileUpload {
    constructor() {
    }

    init() {
        if (typeof Dropzone === 'undefined') {
            console.warn("Dropzone is not loaded.");
            return;
        }

        Dropzone.autoDiscover = false;

        const dropzones = document.querySelectorAll('[data-plugin="dropzone"]');
        if (dropzones) {
            dropzones.forEach(dropzoneEl => {
                const actionUrl = dropzoneEl.getAttribute('action') || '/';
                const previewContainer = dropzoneEl.dataset.previewsContainer;
                const uploadPreviewTemplate = dropzoneEl.dataset.uploadPreviewTemplate;

                const options = {
                    url: actionUrl,
                    acceptedFiles: 'image/*',
                };

                if (previewContainer) {
                    options.previewsContainer = previewContainer;
                }

                if (uploadPreviewTemplate) {
                    const template = document.querySelector(uploadPreviewTemplate);
                    if (template) {
                        options.previewTemplate = template.innerHTML;
                    }
                }

                try {
                    new Dropzone(dropzoneEl, options);
                } catch (e) {
                    console.error("Dropzone initialization failed:", e);
                }
            });
        }
    }
}

function initializeFileUpload() {
    new FileUpload().init();
}

// Initialize on both DOMContentLoaded and turbo:load
document.addEventListener("DOMContentLoaded", initializeFileUpload);
document.addEventListener("turbo:load", initializeFileUpload);
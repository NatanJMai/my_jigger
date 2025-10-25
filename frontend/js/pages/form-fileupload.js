/**
 * Template Name: UBold - Admin & Dashboard Template
 * By (Author): Coderthemes
 * Module/App (File Name): Form Fileupload
 */
import Dropzone from 'dropzone'
import * as FilePond from 'filepond';
import 'filepond-plugin-file-validate-size'
import 'filepond-plugin-image-preview'
import 'filepond-plugin-image-exif-orientation'
import 'filepond-plugin-file-encode'

class FileUpload {
    constructor() {
        this.init();
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

document.addEventListener("DOMContentLoaded", () => {
    new FileUpload();

    if (typeof FilePond !== 'undefined') {
        // FilePond Plugins
        try {
            FilePond.registerPlugin(FilePondPluginImagePreview);
        } catch (e) {
            console.warn("FilePond plugins registration failed:", e);
        }

        // multiple-file inputs
        const multiInputs = document.querySelectorAll("input.filepond-input-multiple");
        multiInputs.forEach(input => {
            FilePond.create(input);
        });

        // circle-style FilePond inputs
        const circleInputs = document.querySelectorAll("input.filepond-input-circle");
        circleInputs.forEach(input => {
            FilePond.create(input, {
                imageCropAspectRatio: "1:1",
                imageResizeTargetWidth: 200,
                imageResizeTargetHeight: 200,
                stylePanelLayout: "compact circle",
                styleLoadIndicatorPosition: "center bottom",
                styleProgressIndicatorPosition: "right bottom",
                styleButtonRemoveItemPosition: "left bottom",
                styleButtonProcessItemPosition: "right bottom",
                allowImagePreview: true,
                imagePreviewHeight: 100,
                labelIdle: `<i class="fs-32 text-muted ti ti-camera"></i>`,
            });
        });
    } else {
        console.warn("FilePond is not loaded.");
    }
});
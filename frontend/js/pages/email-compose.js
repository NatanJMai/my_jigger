/**
 * Template Name: UBold - Admin & Dashboard Template
 * By (Author): Coderthemes
 * Module/App (File Name): Email Compose Editor
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
    icons['video'] = '<i class="ti ti-video fs-lg"></i>'
    icons['color'] = '<i class="ti ti-paint fs-lg"></i>'


    // Quill editor
    const snowEditor = document.getElementById('snow-editor')
    if (snowEditor) {
        new Quill(snowEditor, {
            theme: 'snow',
            modules: {
                'toolbar': [[{ 'header': [false, 1, 2, 3, 4, 5, 6] }], ['bold', 'italic', 'underline', 'strike'], [{ 'color': [] }, { 'background': [] }], ['blockquote', 'code-block'], [{ 'list': 'ordered' }, { 'list': 'bullet' }], ['link', 'image', 'video']]
            },
        });
    }
}
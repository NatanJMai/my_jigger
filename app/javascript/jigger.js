document.addEventListener('turbo:load', () => {
    $('#sidebarCollapse').on('click', function() {
        $('#sidebar, #content, #alert-div, #alert-msg').toggleClass('active');
    });
});


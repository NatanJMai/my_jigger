$(function() {
    // Sidebar toggle behavior
    $('#sidebarCollapse').on('click', function() {
        $('#sidebar, #content, #alert-div, #alert-msg').toggleClass('active');
    });
});

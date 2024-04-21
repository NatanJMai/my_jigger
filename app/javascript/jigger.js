// Function to set up event listeners
function setupEventListeners() {
    document.addEventListener('change', function(event) {
        if (event.target && event.target.matches('.inline-datasheet-price')) {
            // Get the input element within the class .inline-datasheet-price
            let inputElement = document.querySelector('input.inline-datasheet-price');
            let icon = $('.datasheet-price-refresh');

            if (inputElement) {
                // Get the value of the input element
                let value = inputElement.value;
                let url = inputElement.getAttribute('data-url');

                if (value) {
                    icon.addClass('fa-spin');

                    setTimeout(() => {
                        $.ajax({
                            url: url,
                            method: 'GET',
                            dataType: 'JSON',
                            data: {
                                customer_price: value
                            },
                            success: function(response) {
                                $('.datasheet-cmv').text(response['cmv'] + '%');
                            },
                            error: function(xhr, status, error) {
                            }
                        });

                        icon.removeClass('fa-spin');
                    }, 500);
                }
            }
        }
    });

    // Vertical menu toggl
    document.addEventListener('turbo:load', () => {
        $('#sidebarCollapse').on('click', function() {
            $('#sidebar, #content, #alert-div, #alert-msg').toggleClass('active');
        });

    });

    $('.datasheet-price-refresh').on('click', function() {
        location.reload();
    });
}

// Call the setup function on initial page load
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
});

// Reapply event listeners after Turbo Streams actions
document.addEventListener('turbo:load', function() {
    setupEventListeners();
});
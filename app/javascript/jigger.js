// Vertical menu toggl
document.addEventListener('turbo:load', () => {
    $('#sidebarCollapse').on('click', function() {
        $('#sidebar, #content, #alert-div, #alert-msg').toggleClass('active');
    });

    $('.inline-datasheet-price').on('change', function() {
        // Get the input element within the class .inline-datasheet-price
        let inputElement = document.querySelector('input.inline-datasheet-price');

        if (inputElement) {
            // Get the value of the input element
            let value = inputElement.value;
            let url = inputElement.getAttribute('data-url');

            $.ajax({
                url: url,
                type: 'GET',
                data: {
                   customer_price: value
                },
                success: function(response) {
                    console.log(response); // Handle the response data here
                },
                error: function(xhr, status, error) {
                    console.log('Error:', error);
                }
            });
        }
    });
});

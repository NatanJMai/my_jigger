
$(document).on('change', '.ingredient-js', function() {
  let selectedValue = $(this).val();
  let url = $(this).data('url');

  if (selectedValue && url) {
    $.ajax({
      url: url,
      type: 'GET',
      data: {
        id: selectedValue
      },
      dataType: "json",
      success: function(response) {
        $('.volume-js').val(response.volume);
        $('.cost-cents-js').val(response.cost_cents);
        $('.unit-js').val(response.unit).trigger('change');
        $('.quantity-js').val(response.quantity);
        $('.calculated-price-js').text(response.calculated_price);
      },
      error: function() {
        console.log("Error fetching data.");
      }
    });
  }
});

//
$(document).on('change', '.volume-js, .cost-cents-js, .quantity-js', function() {
  const $row = $(this).closest('.row');

  let volume = $row.find('.volume-js').val();
  let cost_cents = $row.find('.cost-cents-js').val();
  let quantity = $row.find('.quantity-js').val();
  let url = $(this).data('url');

  if (url) {
    $.ajax({
      url: url,
      type: 'GET',
      data: {
        volume: volume,
        cost_cents: cost_cents,
        quantity: quantity
      },
      dataType: "json",
      success: function(response) {
        console.log(response.calculated_price);
        $row.find('.calculated-price-js').text(response.calculated_price);
      },
      error: function() {
        console.log("Error fetching data.");
      }
    });
  }
});

$(document).on('change', '.quantity-inline-edit-js', function() {
  const $input = $(this);
  const newQuantity = $input.val();
  const url = $input.data('url');

  if (!url || newQuantity === '') {
    console.warn("Update skipped: Missing URL or quantity.");
    return;
  }

  const $row = $input.closest('tr');

  // --- Manual CSRF Token Inclusion ---
  const csrfToken = $('meta[name="csrf-token"]').attr('content');
  const csrfParam = $('meta[name="csrf-param"]').attr('content');

  let postData = {
    datasheet_line: {
      quantity: newQuantity
    }
  };
  // Add CSRF token to the data
  if (csrfParam && csrfToken) {
    postData[csrfParam] = csrfToken;
  }
  // --- End Manual CSRF Token Inclusion ---

  $.ajax({
    url: url,
    type: 'PATCH',
    data: postData,
    dataType: "json",
    success: function(response) {
      console.log("Datasheet line updated successfully. Response:", response);
      $row.find('.calculated-price-js').text(response.calculated_price);

      if (response.turbo_stream_updates) {
        // This command relies on the Turbo library to process the stream commands
        // and update the 'totals' turbo frame.
        Turbo.renderStreamMessage(response.turbo_stream_updates);
      }

      $input.addClass('is-valid').delay(800).queue(function(next){
        $(this).removeClass('is-valid');
        next();
      });
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.error("Error updating datasheet line:", textStatus, errorThrown);
      console.log(jqXHR.responseText);
      $input.addClass('is-invalid');
      alert("Error updating quantity. Please try again.");
    }
  });
});

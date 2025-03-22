
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


$(document).on('change', '.volume-js, .cost-cents-js, .quantity-js', function() {
  let volume = $('.volume-js').val();
  let cost_cents = $('.cost-cents-js').val();
  let quantity = $('.quantity-js').val();
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
        $('.calculated-price-js').text(response.calculated_price);
      },
      error: function() {
        console.log("Error fetching data.");
      }
    });
  }
});

$(document).on('click', '.name-js', function() {
  let elementId = $(this).data('ingredient-id');
  let url = $(this).data('url');

  if (url) {
    $.ajax({
      url: url,
      type: 'GET',
      data: {},
      success: function(response) {
        // $('.calculated-price-js').text(response.calculated_price);
      },
      error: function() {
        console.log("Error fetching data.");
      }
    });
  }
});
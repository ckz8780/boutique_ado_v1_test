/*
    Core logic/payment flow for this comes from here:
    https://stripe.com/docs/payments/accept-a-payment

    CSS from here: 
    https://stripe.com/docs/stripe-js
*/

var stripe_public_key = $('#id_stripe_public_key').text().slice(1, -1);
var client_secret = $('#id_client_secret').text().slice(1, -1);

// from {% csrf_token %} in the checkout form
var csrf_token = $('input[name="csrfmiddlewaretoken"]').val();

// Set up stripe and Elements
var stripe = Stripe(stripe_public_key);
var elements = stripe.elements();

var style = {
    base: {
        color: '#000',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
            color: '#aab7c4'
        }
    },
    invalid: {
        color: '#dc3545', // Bootstrap 4 text-danger
        iconColor: '#dc3545'
    }
};

// Create an instance of the card Element.
var card = elements.create('card', {style: style});

// Add an instance of the card Element into the `card-element` <div>.
card.mount('#card-element');

// Handle real-time validation errors from the card Element.
// card.addEventListener('change', function(event) {
//     var errorDiv = document.getElementById('card-errors');
//     if (event.error) {
//         var html = `
//             <span class="icon" role="alert">
//                 <i class="fas fa-times"></i>
//             </span>
//             <span>${event.error.message}</span>
//         `
//         $(errorDiv).html(html);
//     } else {
//         errorDiv.textContent = '';
//     }
// });

// // Handle form submission.
// var form = document.getElementById('payment-form');
// form.addEventListener('submit', function(ev) {
//     ev.preventDefault();
//     card.update({'disabled': true});
//     $('#submit-button').attr('disabled', true);
//     $('#payment-form').fadeToggle(100)
//     $('#loading-overlay').fadeToggle(100)

//     var save_info = Boolean($('#id-save-info').attr('checked'));
//     var metadata = {
//         'csrfmiddlewaretoken': '{{ csrf_token }}',
//         'client_secret': '{{ client_secret }}',
//         'save_info': save_info,
//     };
//     var url = '/checkout/cache_checkout_data/';

//     $.post(url, metadata).done(function(){
//         stripe.confirmCardPayment('{{ client_secret }}', {
//             payment_method: {
//                 card: card,
//                 billing_details: {
//                     name: $.trim(form.full_name.value),
//                     phone: $.trim(form.phone_number.value),
//                     email: $.trim(form.email.value),
//                     address: {
//                         line1: $.trim(form.street_address1.value),
//                         line2: $.trim(form.street_address2.value),
//                         city: $.trim(form.town_or_city.value),
//                         country: $.trim(form.country.value),
//                         state: $.trim(form.county.value),
//                     }
//                 },
//             },
//             shipping: {
//                 name: $.trim(form.full_name.value),
//                 phone: $.trim(form.phone_number.value),
//                 address: {
//                     line1: $.trim(form.street_address1.value),
//                     line2: $.trim(form.street_address2.value),
//                     city: $.trim(form.town_or_city.value),
//                     country: $.trim(form.country.value),
//                     postal_code: $.trim(form.postcode.value),
//                     state: $.trim(form.county.value),
//                 }
//             },
//         }).then(function(result) {
//             if (result.error) {
//                 // Inform the user if there was an error.
//                 var errorDiv = document.getElementById('card-errors');
//                 var html = `
//                     <span class="icon" role="alert">
//                         <i class="fas fa-times"></i>
//                     </span>
//                     <span>${result.error.message}</span>
//                 `
//                 $(errorDiv).html(html);
//                 $('#loading-overlay').fadeToggle(100)
//                 $('#payment-form').fadeToggle(100)
//                 card.update({'disabled': false});
//                 $('#submit-button').attr('disabled', false);
//             } else {
//                 // The payment has been processed!
//                 if (result.paymentIntent.status === 'succeeded') {
//                     form.submit();
//                 }
//             }
//         });
//     }).fail(function() {
//         // Just reload the page, the error will be in Django messages
//         location.reload();
//     })
// });
var stripeKey = window.stripeKey;

if (stripeKey != null) {

    var stripe = Stripe(stripeKey);
    var elements = stripe.elements();
}


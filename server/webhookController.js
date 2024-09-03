require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_KEYS);
const Cart = require('./model/Cart');
const Order = require('./model/Order');
const { main, mainHTML } = require('./config/nodeMailer');
const receiptEmail = require('./utils/receiptEmail')
const endpointSecret = process.env.END_POINT_SECRET;
console.log(endpointSecret)
console.log(stripe)

exports.handleWebhook = async (req, res) => {

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log('Webhook verified');
  } catch (err) {
    console.log(`Webhook Error: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;

    const customer = await stripe.customers.retrieve(paymentIntent.customer);

    const cartId = customer.metadata.cartId;

    const cart = await Cart.findById(cartId);
      
    

    let discount;
    let subTotal;
    let total
    const convertAmountFromCent = paymentIntent.amount / 100;
  
    if(customer.metadata.coupon === 'true'){
      discount = (convertAmountFromCent / 0.9) - convertAmountFromCent;
      subTotal = (convertAmountFromCent / 0.9)
      total = convertAmountFromCent
    }else{
      discount = 0
      subTotal = convertAmountFromCent
      total = convertAmountFromCent
    }

    const order = new Order({
      userId: customer.metadata.userId,
      orderId: customer.metadata.orderId,
      discount,
      email: customer.email, 
      paymentMethodTypes: paymentIntent.payment_method_types,
      paymentStatus: paymentIntent.status,
      amountSubtotal: subTotal,
      amountTotal: total,
      currency: paymentIntent.currency,
      shipping: paymentIntent.shipping,
      customerDetails: paymentIntent.shipping,
      cart: cart.items 
    });
  
    let orderDiscount;
    if(customer.metadata.coupon === 'true'){
      orderDiscount = discount
    }else{
      orderDiscount = 'N/A'
    }

    try {
      await order.save();
      const message = receiptEmail(customer.name, cart.items, total, orderDiscount, subTotal, paymentIntent.shipping.address.line1)
       await mainHTML(customer.email, message.subject, message.html);
    } catch (error) {
      console.log('Error saving order:', error);
    }
 
    await Cart.deleteOne({ userId: cart.userId });
  }

  res.send().end();
};

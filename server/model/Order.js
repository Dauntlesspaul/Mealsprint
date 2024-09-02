const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  orderId: {type: String, required: true},
  email: {type: String, required: true},
  discount: {type: Number},
  paymentStatus: { type: String, required: true },
  paymentMethodTypes: [{type: String, required: true}],
  deliveryStatus: { type: String, default: 'pending' },
  amountSubtotal: { type: Number, required: true },
  amountTotal: { type: Number, required: true },
  currency: { type: String,},
  shipping: {
    address: { type: Object},
    name: { type: String},
  },
  customerDetails: {
  address: {type: Object},
  email: {type: String},
  name: {type: String},
  phone: { type: mongoose.Schema.Types.Mixed }
  },
  cart: [{ type: Object, required: true }] 
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);

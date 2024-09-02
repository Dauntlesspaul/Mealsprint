const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  userId: {type: String},
  items: [{ type: Object, required: true }],
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, 
  },
}, { timestamps: true });

module.exports = mongoose.model('Cart', CartSchema);

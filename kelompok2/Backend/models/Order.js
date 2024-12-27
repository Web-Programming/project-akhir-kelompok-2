const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  id: String,
  name: String,
  price: Number,
  quantity: Number,
  imageUrl: String,
  stock: Number
});

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  items: [orderItemSchema],
  total: Number,
  address: String,
  phone: String,
  paymentMethod: String,
  status: {
    type: String,
    enum: ['pending', 'paid', 'completed', 'cancelled'],
    default: 'pending'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);

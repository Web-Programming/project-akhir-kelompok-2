const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    foodItems: [
        {
            itemName: { type: String, required: true },
            quantity: { type: Number, required: true }
        }
    ],
    status: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'In Progress', 'Completed']
    }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;

const mongoose = require('mongoose');

const paymentConfirmationSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    paymentDate: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    status: { type: String, default: 'Pending', enum: ['Pending', 'Confirmed', 'Rejected'] },
});

const PaymentConfirmation = mongoose.model('PaymentConfirmation', paymentConfirmationSchema);
module.exports = PaymentConfirmation;

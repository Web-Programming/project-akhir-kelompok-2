const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    orderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Order', 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    paymentMethod: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'rejected'],
        default: 'pending'
    },
    paymentDate: { 
        type: Date, 
        default: Date.now 
    },
    proofOfPayment: { 
        type: String, // URL to payment proof image
        required: true 
    },
    customerName: { 
        type: String, 
        required: true 
    },
    customerEmail: { 
        type: String, 
        required: true 
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment; 
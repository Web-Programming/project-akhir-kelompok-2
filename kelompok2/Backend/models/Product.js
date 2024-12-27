const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    imageUrl: { type: String, required: true },
    quantity: { type: Number, default: 1 }
}, {
    collection: 'products',
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
const customerController = require('../controllers/customerController');
const paymentController = require('../controllers/paymentController');

// Produk
router.get('/products', productController.getAllProducts);
router.post('/products', productController.addProduct);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

// Pesanan
router.get('/orders', orderController.getAllOrders);
router.put('/orders/:id/status', orderController.updateOrderStatus);
router.delete('/orders/:id', orderController.deleteOrder);

// Pembeli
router.get('/customers', customerController.getAllCustomers);
router.delete('/customers/:id', customerController.deleteCustomer);

// Konfirmasi Pembayaran
router.get('/payments', paymentController.getAllPayments);
router.post('/payments', paymentController.addPaymentConfirmation);

module.exports = router;


const express = require('express');
const {
    getAllOrders,
    createOrder,
    updateOrderStatus,
    deleteOrder
} = require('../controllers/orderController');

const router = express.Router();

// GET all orders
router.get('/', getAllOrders);

// POST a new order
router.post('/', createOrder);

// PATCH update order status
router.patch('/:id', updateOrderStatus);

// DELETE an order
router.delete('/:id', deleteOrder);

module.exports = router;

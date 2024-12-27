const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// Create new order
router.post('/', async (req, res) => {
  try {
    const order = new Order({
      items: req.body.items,
      total: req.body.total,
      customerDetails: req.body.customerDetails,
      status: 'pending'
    });
    
    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all orders
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all orders');
    const orders = await Order.find().sort({ date: -1 });
    console.log(`Found ${orders.length} orders`);
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: error.message });
  }
});

// Confirm payment
router.put('/:id/confirm-payment', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Confirming payment for order:', id);

    const order = await Order.findById(id);
    
    if (!order) {
      console.log('Order not found:', id);
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = 'paid';
    await order.save();

    console.log('Order updated successfully:', order);
    res.json({ message: 'Payment confirmed successfully', order });

  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ message: 'Error confirming payment', error: error.message });
  }
});

// Complete order and update stock
router.put('/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Completing order:', id);

    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update order status
    order.status = 'completed';
    await order.save();

    res.json({ 
      message: 'Order completed successfully', 
      order 
    });

  } catch (error) {
    console.error('Error completing order:', error);
    res.status(500).json({ 
      message: 'Error completing order', 
      error: error.message 
    });
  }
});

// Add this route to handle order cancellation
router.put('/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Cancelling order:', id);

    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ 
        message: 'Only pending orders can be cancelled' 
      });
    }

    // Restore stock for each item in the order
    for (const item of order.items) {
      console.log('Restoring stock for item:', item);
      
      const product = await Product.findById(item.id);
      if (product) {
        // Add the cancelled quantity back to stock
        product.stock += item.quantity;
        await product.save();
        
        console.log('Stock restored for product:', {
          productId: item.id,
          oldStock: product.stock - item.quantity,
          newStock: product.stock,
          restoredAmount: item.quantity
        });
      }
    }

    // Update order status
    order.status = 'cancelled';
    await order.save();

    console.log('Order cancelled and stock restored successfully:', order);
    res.json({ 
      message: 'Order cancelled and stock restored successfully', 
      order 
    });

  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ 
      message: 'Error cancelling order', 
      error: error.message 
    });
  }
});

// Get orders by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Fetching orders for user:', userId);

    const orders = await Order.find({ userId }).sort({ date: -1 });
    console.log(`Found ${orders.length} orders for user ${userId}`);
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create new order
router.post('/create', async (req, res) => {
  try {
    console.log('Received order data:', req.body); // Debug log

    const { userId, items, total, address, phone, paymentMethod, status } = req.body;

    if (!userId) {
      console.log('Missing userId in request');
      return res.status(400).json({ message: 'userId is required' });
    }

    const order = new Order({
      userId,
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
        stock: item.quantity
      })),
      total,
      address,
      phone,
      paymentMethod,
      status: status || 'pending'
    });
    
    console.log('Creating order:', order); // Debug log
    
    const savedOrder = await order.save();
    console.log('Order saved successfully:', savedOrder); // Debug log
    
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(400).json({ 
      message: error.message,
      details: error.errors // Include validation errors if any
    });
  }
});

module.exports = router;

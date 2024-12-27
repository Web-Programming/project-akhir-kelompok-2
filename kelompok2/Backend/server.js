const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/productRoutes');
const adminRoutes = require('./routes/adminRoutes');
const Order = require('./models/Order');

const app = express();
const path = require('path');
// Middleware
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Routes
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', require('./routes/userRoutes'));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Register the upload route
const uploadRoutes = require('./routes/upload');
app.use('/api/upload', uploadRoutes);

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/kelompok2-backend')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Get all orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 });
    console.log('Fetched orders:', orders); // Debug log
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Update order status
app.put('/api/orders/:id', async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(400).json({ message: error.message });
  }
});

// Create order endpoint
app.post('/api/orders', async (req, res) => {
  try {
    // Log the raw request
    console.log('Raw request body:', req.body);
    console.log('Content-Type:', req.get('Content-Type'));

    // Ensure we have the required fields
    const { items, total, address, phone, paymentMethod, status } = req.body;

    // Create the order with explicit fields
    const order = new Order({
      items: items || [],
      total: total || 0,
      address: address || '',
      phone: phone || '',
      paymentMethod: paymentMethod || 'transfer',
      status: status || 'pending'
    });

    // Log the order before saving
    console.log('Order before save:', order);

    // Save the order
    const savedOrder = await order.save();
    console.log('Saved order:', savedOrder);

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(400).json({ message: error.message });
  }
});

// Add this with your other routes
app.post('/api/payments', async (req, res) => {
  try {
    // For now, just acknowledge the payment without file handling
    res.status(200).json({ message: 'Payment confirmed' });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ message: 'Error processing payment' });
  }
});

// Create initial order
app.post('/api/orders/create', async (req, res) => {
  try {
    console.log('Creating initial order:', req.body);

    const orderData = {
      items: req.body.items,
      total: req.body.total,
      address: req.body.address,
      phone: req.body.phone,
      paymentMethod: req.body.paymentMethod,
      status: 'pending', // Initial status
      date: new Date()
    };

    const order = new Order(orderData);
    const savedOrder = await order.save();
    console.log('Initial order saved:', savedOrder);

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating initial order:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update order status after payment confirmation
app.put('/api/orders/:id/confirm-payment', async (req, res) => {
  try {
    const orderId = req.params.id;
    console.log('Confirming payment for order:', orderId);

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: 'paid' },
      { new: true }
    );

    if (!updatedOrder) {
      throw new Error('Order not found');
    }

    console.log('Order updated:', updatedOrder);
    res.json(updatedOrder);
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(400).json({ message: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ 
    message: 'Internal server error', 
    error: err.message 
  });

  app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
});

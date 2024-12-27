const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await Customer.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const customer = new Customer({
      name,
      email,
      password: hashedPassword
    });

    await customer.save();

    res.status(201).json({ message: 'Registrasi berhasil' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if it's admin login
    if (email === 'admin@gmail.com' && password === 'admin123') {
      const token = jwt.sign(
        { 
          userId: 'admin',
          isAdmin: true 
        },
        'your_jwt_secret',
        { expiresIn: '1h' }
      );
      return res.json({ 
        token,
        userId: 'admin',
        isAdmin: true,
        message: 'Admin login successful'
      });
    }

    // If not admin, proceed with regular customer login
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(400).json({ message: 'Email atau password salah' });
    }

    const validPassword = await bcrypt.compare(password, customer.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Email atau password salah' });
    }

    const token = jwt.sign(
      { 
        userId: customer._id, 
        isAdmin: false 
      },
      'your_jwt_secret',
      { expiresIn: '1h' }
    );

    res.json({ 
      token,
      userId: customer._id,
      isAdmin: false,
      message: 'Login successful'
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 
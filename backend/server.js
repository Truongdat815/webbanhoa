const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Mock data
let products = [
  {
    id: 1,
    name: "Hoa Hồng Đỏ",
    price: 250000,
    oldPrice: 300000,
    image: "/assets/placeholder-1.jpg",
    category: "hoa-sinh-nhat",
    description: "Hoa hồng đỏ tươi, ý nghĩa tình yêu",
    discount: 17
  },
  {
    id: 2,
    name: "Hoa Tulip Vàng",
    price: 180000,
    oldPrice: 220000,
    image: "/assets/placeholder-2.jpg",
    category: "hoa-khai-truong",
    description: "Hoa tulip vàng tươi sáng",
    discount: 18
  },
  {
    id: 3,
    name: "Hoa Cẩm Chướng",
    price: 120000,
    oldPrice: 150000,
    image: "/assets/placeholder-3.jpg",
    category: "hoa-sinh-nhat",
    description: "Hoa cẩm chướng nhiều màu",
    discount: 20
  },
  {
    id: 4,
    name: "Hoa Ly Trắng",
    price: 200000,
    oldPrice: 250000,
    image: "/assets/placeholder-4.jpg",
    category: "hoa-chuc-mung",
    description: "Hoa ly trắng thanh lịch",
    discount: 20
  },
  {
    id: 5,
    name: "Hoa Hướng Dương",
    price: 160000,
    oldPrice: 200000,
    image: "/assets/placeholder-5.jpg",
    category: "hoa-khai-truong",
    description: "Hoa hướng dương rực rỡ",
    discount: 20
  },
  {
    id: 6,
    name: "Hoa Lan Tím",
    price: 300000,
    oldPrice: 350000,
    image: "/assets/placeholder-6.jpg",
    category: "hoa-sinh-nhat",
    description: "Hoa lan tím quý phái",
    discount: 14
  },
  {
    id: 7,
    name: "Hoa Cúc Vàng",
    price: 140000,
    oldPrice: 180000,
    image: "/assets/placeholder-7.jpg",
    category: "hoa-chuc-mung",
    description: "Hoa cúc vàng tươi vui",
    discount: 22
  },
  {
    id: 8,
    name: "Hoa Đào Hồng",
    price: 220000,
    oldPrice: 280000,
    image: "/assets/placeholder-8.jpg",
    category: "hoa-sinh-nhat",
    description: "Hoa đào hồng lãng mạn",
    discount: 21
  }
];

let users = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "admin@bloomora.com",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    role: "admin"
  }
];

let orders = [];
let cart = {};

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'bloomora_secret_key_2024';

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Bloomora API is running' });
});

// Products API
app.get('/api/products', (req, res) => {
  const { category, search, sort } = req.query;
  let filteredProducts = [...products];

  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }

  if (search) {
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (sort) {
    switch (sort) {
      case 'price-asc':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'discount':
        filteredProducts.sort((a, b) => b.discount - a.discount);
        break;
    }
  }

  res.json(filteredProducts);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// Categories API
app.get('/api/categories', (req, res) => {
  const categories = [
    { id: 'hoa-sinh-nhat', name: 'Hoa Sinh Nhật' },
    { id: 'hoa-khai-truong', name: 'Hoa Khai Trương' },
    { id: 'hoa-chuc-mung', name: 'Hoa Chúc Mừng' },
    { id: 'hoa-tinh-yeu', name: 'Hoa Tình Yêu' }
  ];
  res.json(categories);
});

// Auth API
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: users.length + 1,
      name,
      email,
      password: hashedPassword,
      role: 'user'
    };

    users.push(newUser);

    const token = jwt.sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET);
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);
    
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cart API
app.get('/api/cart/:userId', (req, res) => {
  const userId = req.params.userId;
  res.json(cart[userId] || []);
});

app.post('/api/cart/:userId', (req, res) => {
  const userId = req.params.userId;
  const { productId, quantity } = req.body;
  
  if (!cart[userId]) {
    cart[userId] = [];
  }

  const existingItem = cart[userId].find(item => item.productId === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    const product = products.find(p => p.id === productId);
    if (product) {
      cart[userId].push({
        productId,
        quantity,
        product: { ...product }
      });
    }
  }

  res.json(cart[userId]);
});

app.delete('/api/cart/:userId/:productId', (req, res) => {
  const userId = req.params.userId;
  const productId = parseInt(req.params.productId);
  
  if (cart[userId]) {
    cart[userId] = cart[userId].filter(item => item.productId !== productId);
  }
  
  res.json(cart[userId] || []);
});

// Orders API
app.post('/api/orders', (req, res) => {
  const { userId, items, total, shippingAddress, paymentMethod } = req.body;
  
  const newOrder = {
    id: orders.length + 1,
    userId,
    items,
    total,
    shippingAddress,
    paymentMethod,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  orders.push(newOrder);
  
  // Clear cart after order
  cart[userId] = [];
  
  res.status(201).json(newOrder);
});

app.get('/api/orders/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const userOrders = orders.filter(order => order.userId === userId);
  res.json(userOrders);
});

// Start server
app.listen(PORT, () => {
  console.log(`🌸 Bloomora Backend API running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/api/health`);
});

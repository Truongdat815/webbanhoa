import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import axios from 'axios'

// Components
import Header from './components/Header'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Products from './components/Products'
import ProductDetail from './components/ProductDetail'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'

// Context
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'

// API Configuration
axios.defaults.baseURL = 'http://localhost:8080/api'

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/products')
      setProducts(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <AuthProvider>
      <CartProvider>
        <div className="App">
          <Header />
          
          <main>
            <Routes>
              <Route path="/" element={
                <>
                  <Hero />
                  <Products products={products} />
                </>
              } />
              <Route path="/products" element={<Products products={products} />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  )
}

export default App

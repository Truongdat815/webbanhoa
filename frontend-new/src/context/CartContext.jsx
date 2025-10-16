import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchCartItems()
    } else {
      setCartItems([])
    }
  }, [user])

  const fetchCartItems = async () => {
    try {
      const response = await axios.get(`/cart/${user.id}`)
      setCartItems(response.data)
    } catch (error) {
      console.error('Error fetching cart items:', error)
    }
  }

  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng')
      return
    }

    try {
      await axios.post(`/cart/${user.id}`, {
        productId: product.id,
        quantity
      })
      await fetchCartItems()
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  const removeFromCart = async (productId) => {
    if (!user) return

    try {
      await axios.delete(`/cart/${user.id}/${productId}`)
      await fetchCartItems()
    } catch (error) {
      console.error('Error removing from cart:', error)
    }
  }

  const updateQuantity = async (productId, quantity) => {
    if (!user || quantity < 1) return

    try {
      // For simplicity, we'll remove and re-add with new quantity
      await removeFromCart(productId)
      const product = cartItems.find(item => item.productId === productId)?.product
      if (product) {
        await addToCart(product, quantity)
      }
    } catch (error) {
      console.error('Error updating quantity:', error)
    }
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity)
    }, 0)
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

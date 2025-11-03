import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const Checkout = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [orderData, setOrderData] = useState({
    shippingAddress: '',
    paymentMethod: 'cod'
  })

  if (!user) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h2>Vui lòng đăng nhập để thanh toán</h2>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/login')}
          >
            Đăng nhập
          </button>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h2>Giỏ hàng trống</h2>
          <p>Hãy thêm một số sản phẩm vào giỏ hàng của bạn</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/products')}
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const total = getTotalPrice() + (getTotalPrice() > 500000 ? 0 : 30000)
      
      const orderPayload = {
        userId: user.id,
        items: cartItems,
        total,
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod
      }

      await axios.post('/orders', orderPayload)
      clearCart()
      navigate('/dashboard?order=success')
    } catch (error) {
      console.error('Error placing order:', error)
      alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">Thanh toán</h2>
      
      <div className="row">
        <div className="col-md-8">
          <form onSubmit={handleSubmit}>
            <div className="card mb-4">
              <div className="card-header">
                <h5>Thông tin giao hàng</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="shippingAddress" className="form-label">Địa chỉ giao hàng</label>
                  <textarea
                    className="form-control"
                    id="shippingAddress"
                    rows="3"
                    value={orderData.shippingAddress}
                    onChange={(e) => setOrderData({...orderData, shippingAddress: e.target.value})}
                    required
                    placeholder="Nhập địa chỉ giao hàng chi tiết..."
                  />
                </div>
              </div>
            </div>

            <div className="card mb-4">
              <div className="card-header">
                <h5>Phương thức thanh toán</h5>
              </div>
              <div className="card-body">
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="cod"
                    value="cod"
                    checked={orderData.paymentMethod === 'cod'}
                    onChange={(e) => setOrderData({...orderData, paymentMethod: e.target.value})}
                  />
                  <label className="form-check-label" htmlFor="cod">
                    Thanh toán khi nhận hàng (COD)
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="bank"
                    value="bank"
                    checked={orderData.paymentMethod === 'bank'}
                    onChange={(e) => setOrderData({...orderData, paymentMethod: e.target.value})}
                  />
                  <label className="form-check-label" htmlFor="bank">
                    Chuyển khoản ngân hàng
                  </label>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-lg"
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2"></span>
              ) : null}
              Đặt hàng
            </button>
          </form>
        </div>
        
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5>Đơn hàng của bạn</h5>
            </div>
            <div className="card-body">
              {cartItems.map((item) => (
                <div key={item.productId} className="d-flex justify-content-between mb-2">
                  <span>{item.product.name} x{item.quantity}</span>
                  <span>{(item.product.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                </div>
              ))}
              
              <hr />
              
              <div className="d-flex justify-content-between mb-2">
                <span>Tạm tính:</span>
                <span>{getTotalPrice().toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Phí vận chuyển:</span>
                <span>{getTotalPrice() > 500000 ? 'Miễn phí' : '30.000đ'}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <strong>Tổng cộng:</strong>
                <strong className="text-primary">
                  {(getTotalPrice() + (getTotalPrice() > 500000 ? 0 : 30000)).toLocaleString('vi-VN')}đ
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout

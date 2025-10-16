import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h2>Vui lòng đăng nhập để xem giỏ hàng</h2>
          <Link to="/login" className="btn btn-primary">
            Đăng nhập
          </Link>
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
          <Link to="/products" className="btn btn-primary">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">Giỏ hàng của bạn</h2>
      
      <div className="row">
        <div className="col-md-8">
          {cartItems.map((item) => (
            <div key={item.productId} className="card mb-3">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-2">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name}
                      className="img-fluid rounded"
                    />
                  </div>
                  <div className="col-md-4">
                    <h5>{item.product.name}</h5>
                    <p className="text-muted mb-0">{item.product.description}</p>
                  </div>
                  <div className="col-md-2">
                    <div className="input-group">
                      <button 
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >
                        -
                      </button>
                      <input 
                        type="number" 
                        className="form-control form-control-sm text-center"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                      />
                      <button 
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <span className="fw-bold text-primary">
                      {(item.product.price * item.quantity).toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                  <div className="col-md-2">
                    <button 
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => removeFromCart(item.productId)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5>Tổng đơn hàng</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Tạm tính:</span>
                <span>{getTotalPrice().toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Phí vận chuyển:</span>
                <span>{getTotalPrice() > 500000 ? 'Miễn phí' : '30.000đ'}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <strong>Tổng cộng:</strong>
                <strong className="text-primary">
                  {(getTotalPrice() + (getTotalPrice() > 500000 ? 0 : 30000)).toLocaleString('vi-VN')}đ
                </strong>
              </div>
              
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/checkout')}
                >
                  Tiến hành thanh toán
                </button>
                <Link to="/products" className="btn btn-outline-secondary">
                  Tiếp tục mua sắm
                </Link>
                <button 
                  className="btn btn-outline-danger"
                  onClick={clearCart}
                >
                  Xóa giỏ hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart

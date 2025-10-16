import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import axios from 'axios'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/products/${id}`)
      setProduct(response.data)
    } catch (error) {
      console.error('Error fetching product:', error)
      navigate('/products')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    addToCart(product, quantity)
    alert(`Đã thêm ${product.name} vào giỏ hàng`)
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h2>Sản phẩm không tồn tại</h2>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/products')}
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-6">
          <img 
            src={product.image} 
            alt={product.name}
            className="img-fluid rounded"
          />
        </div>
        <div className="col-md-6">
          <h1 className="mb-3">{product.name}</h1>
          <div className="product-price mb-3">
            <span className="current-price fs-3 text-primary me-3">
              {product.price.toLocaleString('vi-VN')}đ
            </span>
            <span className="old-price fs-5 text-muted text-decoration-line-through">
              {product.oldPrice.toLocaleString('vi-VN')}đ
            </span>
            <span className="badge bg-danger ms-2">
              -{product.discount}%
            </span>
          </div>
          
          <p className="text-muted mb-4">{product.description}</p>
          
          <div className="mb-4">
            <label className="form-label">Số lượng:</label>
            <div className="input-group" style={{ width: '150px' }}>
              <button 
                className="btn btn-outline-secondary"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <input 
                type="number" 
                className="form-control text-center"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              />
              <button 
                className="btn btn-outline-secondary"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>
          
          <div className="d-grid gap-2 d-md-flex">
            <button 
              className="btn btn-primary btn-lg"
              onClick={handleAddToCart}
            >
              <i className="fas fa-shopping-cart me-2"></i>
              Thêm vào giỏ hàng
            </button>
            <button 
              className="btn btn-outline-primary btn-lg"
              onClick={() => navigate('/checkout')}
            >
              <i className="fas fa-credit-card me-2"></i>
              Mua ngay
            </button>
          </div>
          
          <div className="mt-4">
            <div className="d-flex align-items-center mb-2">
              <i className="fas fa-shipping-fast text-primary me-2"></i>
              <span>Giao hàng miễn phí cho đơn hàng trên 500k</span>
            </div>
            <div className="d-flex align-items-center mb-2">
              <i className="fas fa-undo text-primary me-2"></i>
              <span>Đổi trả trong 7 ngày</span>
            </div>
            <div className="d-flex align-items-center">
              <i className="fas fa-shield-alt text-primary me-2"></i>
              <span>Bảo hành chất lượng hoa tươi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail

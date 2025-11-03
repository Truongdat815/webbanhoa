import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import axios from 'axios'

const Products = ({ products: initialProducts }) => {
  const [products, setProducts] = useState(initialProducts)
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('')
  const { addToCart } = useCart()

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (category) params.append('category', category)
      if (sort) params.append('sort', sort)
      
      const response = await axios.get(`/products?${params}`)
      setProducts(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchProducts()
  }, [category, sort])

  const handleAddToCart = (product) => {
    addToCart(product, 1)
    // Show success message
    console.log(`Added ${product.name} to cart`)
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

  return (
    <section className="products-section">
      <div className="container">
        <h2 className="section-title" data-aos="fade-up">
          BLOOMORA - HOA TƯƠI GIẢM ĐẾN 30%
        </h2>
        
        {/* Filters */}
        <div className="row mb-4">
          <div className="col-md-6">
            <select 
              className="form-select" 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Tất cả danh mục</option>
              <option value="hoa-sinh-nhat">Hoa Sinh Nhật</option>
              <option value="hoa-khai-truong">Hoa Khai Trương</option>
              <option value="hoa-chuc-mung">Hoa Chúc Mừng</option>
              <option value="hoa-tinh-yeu">Hoa Tình Yêu</option>
            </select>
          </div>
          <div className="col-md-6">
            <select 
              className="form-select" 
              value={sort} 
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="">Sắp xếp theo</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
              <option value="name">Tên A-Z</option>
              <option value="discount">Giảm giá nhiều nhất</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {products.map((product, index) => (
            <div 
              key={product.id} 
              className="product-card"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="product-image">
                <Link to={`/product/${product.id}`}>
                  <img src={product.image} alt={product.name} />
                </Link>
                <div className="discount-badge">
                  -{product.discount}%
                </div>
              </div>
              <div className="product-info">
                <h3 className="product-name">
                  <Link to={`/product/${product.id}`}>
                    {product.name}
                  </Link>
                </h3>
                <div className="product-price">
                  <span className="current-price">
                    {product.price.toLocaleString('vi-VN')}đ
                  </span>
                  <span className="old-price">
                    {product.oldPrice.toLocaleString('vi-VN')}đ
                  </span>
                </div>
                <button 
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product)}
                >
                  <i className="fas fa-shopping-cart me-2"></i>
                  ĐẶT HÀNG
                </button>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-5">
            <h4>Không tìm thấy sản phẩm nào</h4>
            <p>Hãy thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default Products

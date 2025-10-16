import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const Header = () => {
  const { user, logout } = useAuth()
  const { cartItems } = useCart()
  const [searchQuery, setSearchQuery] = useState('')

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  const handleSearch = (e) => {
    e.preventDefault()
    // Handle search logic here
    console.log('Searching for:', searchQuery)
  }

  return (
    <>
      {/* Top Bar */}
      <div className="top-bar">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="hotline">
                <i className="fas fa-phone"></i>
                <span>Hotline: 1900 1234</span>
              </div>
            </div>
            <div className="col-md-6">
              <div className="top-links">
                {user ? (
                  <>
                    <Link to="/dashboard">
                      <i className="fas fa-user"></i>
                      {user.name}
                    </Link>
                    <button onClick={logout} className="btn btn-link p-0 text-decoration-none">
                      <i className="fas fa-sign-out-alt"></i>
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login">Đăng nhập</Link>
                    <Link to="/register">Đăng ký</Link>
                  </>
                )}
                <Link to="/cart">
                  <i className="fas fa-shopping-cart"></i>
                  Giỏ hàng
                </Link>
                <Link to="/checkout">
                  <i className="fas fa-credit-card"></i>
                  Thanh toán
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="main-header">
        <div className="container">
          <div className="row align-items-center">
            {/* Social Links */}
            <div className="col-md-3">
              <div className="social-links">
                <a href="#" className="hover-rotate">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="hover-rotate">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="hover-rotate">
                  <i className="fab fa-youtube"></i>
                </a>
                <a href="#" className="hover-rotate">
                  <i className="fab fa-tiktok"></i>
                </a>
              </div>
            </div>

            {/* Logo */}
            <div className="col-md-6 text-center">
              <div className="logo">
                <Link to="/">
                  <img src="/assets/logo.png" alt="Bloomora Logo" className="img-fluid" />
                </Link>
              </div>
            </div>

            {/* Search & Cart */}
            <div className="col-md-3">
              <div className="search-cart">
                <form className="search-box" onSubmit={handleSearch}>
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="search-btn">
                    <i className="fas fa-search"></i>
                  </button>
                </form>
                <Link to="/cart" className="cart-icon">
                  <i className="fas fa-shopping-cart"></i>
                  {cartCount > 0 && (
                    <span className="cart-badge">{cartCount}</span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item dropdown">
                <Link className="nav-link dropdown-toggle" to="/products">
                  Chủ đề
                </Link>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="/products?category=hoa-sinh-nhat">Hoa Sinh Nhật</Link></li>
                  <li><Link className="dropdown-item" to="/products?category=hoa-khai-truong">Hoa Khai Trương</Link></li>
                  <li><Link className="dropdown-item" to="/products?category=hoa-chuc-mung">Hoa Chúc Mừng</Link></li>
                  <li><Link className="dropdown-item" to="/products?category=hoa-tinh-yeu">Hoa Tình Yêu</Link></li>
                </ul>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/products">Tất cả sản phẩm</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/products?sort=discount">Khuyến mãi</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact">Liên hệ</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Header

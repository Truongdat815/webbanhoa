import React from 'react'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text" data-aos="fade-right">
            <h1 className="hero-title">
              BLOOMORA
            </h1>
            <h2 className="hero-subtitle">
              Pure blooms, pure joy
            </h2>
            <p className="mb-4">
              Khám phá thế giới hoa tươi đẹp nhất với Bloomora. 
              Chúng tôi mang đến những bông hoa tươi đẹp nhất 
              và trải nghiệm mua sắm tuyệt vời cho bạn.
            </p>
            <div className="d-flex gap-3 mb-4">
              <div className="d-flex align-items-center gap-2">
                <i className="fas fa-shipping-fast text-primary"></i>
                <small>Giao hàng nhanh</small>
              </div>
              <div className="d-flex align-items-center gap-2">
                <i className="fas fa-leaf text-success"></i>
                <small>Hoa tươi 100%</small>
              </div>
              <div className="d-flex align-items-center gap-2">
                <i className="fas fa-heart text-danger"></i>
                <small>Chất lượng cao</small>
              </div>
            </div>
            <Link to="/products" className="hero-btn">
              Mua ngay
            </Link>
          </div>
          <div className="hero-image" data-aos="fade-left">
            <img src="/assets/hero-image-1.jpg" alt="Bloomora Flowers" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Về Bloomora</h4>
            <p>
              Bloomora - "Pure blooms, pure joy" là thương hiệu hoa tươi cao cấp, 
              mang đến những bông hoa tươi đẹp nhất và trải nghiệm mua sắm tuyệt vời.
            </p>
            <div className="social-links mt-3">
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-youtube"></i></a>
              <a href="#"><i className="fab fa-tiktok"></i></a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Danh mục sản phẩm</h4>
            <ul className="list-unstyled">
              <li><Link to="/products?category=hoa-sinh-nhat">Hoa Sinh Nhật</Link></li>
              <li><Link to="/products?category=hoa-khai-truong">Hoa Khai Trương</Link></li>
              <li><Link to="/products?category=hoa-chuc-mung">Hoa Chúc Mừng</Link></li>
              <li><Link to="/products?category=hoa-tinh-yeu">Hoa Tình Yêu</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Hỗ trợ khách hàng</h4>
            <ul className="list-unstyled">
              <li><Link to="/contact">Liên hệ</Link></li>
              <li><Link to="/shipping">Chính sách giao hàng</Link></li>
              <li><Link to="/return">Chính sách đổi trả</Link></li>
              <li><Link to="/privacy">Chính sách bảo mật</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Thông tin liên hệ</h4>
            <div className="contact-info">
              <p><i className="fas fa-phone me-2"></i>Hotline: 1900 1234</p>
              <p><i className="fas fa-envelope me-2"></i>info@bloomora.com</p>
              <p><i className="fas fa-map-marker-alt me-2"></i>123 Đường Hoa, Quận 1, TP.HCM</p>
              <p><i className="fas fa-clock me-2"></i>8:00 - 22:00 (T2 - CN)</p>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 Bloomora. All rights reserved. | Pure blooms, pure joy.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

# Bloomora - Pure Blooms, Pure Joy 🌸

Ứng dụng bán hoa tươi hiện đại với kiến trúc microservices, tách biệt frontend và backend.

## 🏗️ Kiến trúc Project

```
bloomora/
├── backend/                 # Node.js/Express API
│   ├── server.js           # Main server
│   ├── package.json        # Backend dependencies
│   └── README.md           # Backend documentation
├── frontend-new/            # React/Vite Frontend
│   ├── src/                # React source code
│   ├── public/             # Static assets
│   ├── package.json        # Frontend dependencies
│   └── README.md           # Frontend documentation
└── README.md               # Main documentation
```

## 🚀 Quick Start

### 1. Chạy Backend API
```bash
cd backend
npm install
npm run dev
```
Backend chạy tại: http://localhost:8080

### 2. Chạy Frontend
```bash
cd frontend-new
npm install
npm run dev
```
Frontend chạy tại: http://localhost:5173

### 3. Truy cập ứng dụng
Mở trình duyệt tại: http://localhost:5173

## 🌸 Tính năng chính

### Frontend (React)
- **Trang chủ**: Hero section với animations
- **Sản phẩm**: Grid view, tìm kiếm, lọc theo danh mục
- **Chi tiết sản phẩm**: Hình ảnh, mô tả, đánh giá
- **Giỏ hàng**: Thêm/xóa/sửa số lượng
- **Thanh toán**: Form đặt hàng hoàn chỉnh
- **Tài khoản**: Đăng nhập, đăng ký, dashboard
- **Responsive**: Thiết kế mobile-first

### Backend (Node.js/Express)
- **Products API**: CRUD sản phẩm, tìm kiếm, lọc
- **Authentication**: JWT-based auth
- **Cart API**: Quản lý giỏ hàng theo user
- **Orders API**: Xử lý đơn hàng
- **Categories API**: Danh mục sản phẩm
- **CORS**: Hỗ trợ cross-origin requests

## 🛠️ Công nghệ sử dụng

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool & dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Bootstrap 5** - CSS framework
- **Font Awesome** - Icons
- **AOS** - Scroll animations

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin support
- **Multer** - File uploads

## 📊 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Endpoints chính

#### Products
```bash
GET    /products              # Danh sách sản phẩm
GET    /products/:id          # Chi tiết sản phẩm
GET    /categories            # Danh mục sản phẩm
```

#### Authentication
```bash
POST   /auth/register         # Đăng ký
POST   /auth/login            # Đăng nhập
```

#### Cart
```bash
GET    /cart/:userId          # Lấy giỏ hàng
POST   /cart/:userId          # Thêm vào giỏ hàng
DELETE /cart/:userId/:productId # Xóa khỏi giỏ hàng
```

#### Orders
```bash
POST   /orders                # Tạo đơn hàng
GET    /orders/:userId        # Đơn hàng của user
```

## 🎨 Design System

### Màu sắc
- **Primary**: #e91e63 (Pink)
- **Secondary**: #d81b60 (Dark Pink)
- **Text**: #333333 (Dark Gray)
- **Background**: #f5f5f5 (Light Gray)

### Typography
- **Headings**: Montserrat (600, 700, 800)
- **Body**: Poppins (300, 400, 500, 600)

### Components
- **Buttons**: Rounded corners, hover effects
- **Cards**: Subtle shadows, hover animations
- **Forms**: Bootstrap styling với custom colors

## 🔧 Development

### Thêm tính năng mới

1. **Backend**: Thêm endpoint trong `server.js`
2. **Frontend**: Tạo component trong `src/components/`
3. **Integration**: Cập nhật API calls

### Database Integration

Hiện tại dùng in-memory storage. Để production:
- **MongoDB** + Mongoose
- **PostgreSQL** + Sequelize  
- **MySQL** + Prisma

### Deployment

#### Backend
```bash
cd backend
npm run build
npm start
```

#### Frontend
```bash
cd frontend-new
npm run build
# Deploy dist/ folder
```

## 📱 Responsive Design

- **Desktop**: >= 1200px
- **Tablet**: 768px - 1199px
- **Mobile**: < 768px

## 🔐 Security

- **JWT Authentication** cho API
- **Password hashing** với bcryptjs
- **CORS** configuration
- **Input validation** (cần thêm)

## 🧪 Testing

### API Testing
```bash
# Health check
curl http://localhost:8080/api/health

# Get products
curl http://localhost:8080/api/products
```

### Frontend Testing
```bash
cd frontend-new
npm run test
```

## 📈 Performance

- **Vite** cho fast builds
- **React.lazy** cho code splitting
- **Image optimization** với WebP
- **API caching** (cần implement)

## 🚀 Production Checklist

- [ ] Database integration
- [ ] Environment variables
- [ ] Error handling
- [ ] Logging
- [ ] Rate limiting
- [ ] HTTPS
- [ ] CDN cho assets
- [ ] Monitoring

## 📝 License

MIT License - Xem file LICENSE để biết chi tiết.

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📞 Support

- **Email**: info@bloomora.com
- **Website**: https://bloomora.com
- **Hotline**: 1900 1234

---

**Bloomora** - Pure blooms, pure joy 🌸

*Được phát triển với ❤️ cho cộng đồng yêu hoa*
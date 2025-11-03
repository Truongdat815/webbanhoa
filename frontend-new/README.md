# Bloomora Frontend

React frontend cho ứng dụng bán hoa tươi Bloomora.

## 🌸 Tính năng

- **Trang chủ**: Hero section, sản phẩm nổi bật
- **Sản phẩm**: Danh sách, chi tiết, tìm kiếm, lọc
- **Giỏ hàng**: Thêm/xóa/sửa số lượng
- **Thanh toán**: Form đặt hàng
- **Tài khoản**: Đăng nhập, đăng ký, dashboard
- **Responsive**: Thiết kế tương thích mobile

## 🚀 Cài đặt và chạy

### Yêu cầu
- Node.js >= 18
- npm hoặc yarn

### Cài đặt
```bash
cd frontend-new
npm install
```

### Chạy development
```bash
npm run dev
```

Frontend sẽ chạy tại: http://localhost:5173

### Build production
```bash
npm run build
```

## 🛠️ Công nghệ sử dụng

- **React 18** - UI framework
- **React Router** - Routing
- **Axios** - HTTP client
- **Bootstrap 5** - CSS framework
- **Font Awesome** - Icons
- **Vite** - Build tool

## 📁 Cấu trúc thư mục

```
frontend-new/
├── public/
│   └── assets/          # Hình ảnh, logo
├── src/
│   ├── components/      # React components
│   ├── context/         # React Context
│   ├── App.jsx          # Main App component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── package.json
└── vite.config.js
```

## 🔗 API Integration

Frontend kết nối với backend API tại: http://localhost:8080/api

### Endpoints chính:
- `GET /products` - Danh sách sản phẩm
- `POST /auth/login` - Đăng nhập
- `POST /auth/register` - Đăng ký
- `GET /cart/:userId` - Giỏ hàng
- `POST /orders` - Đặt hàng

## 🎨 Customization

### Màu sắc chính:
```css
--pink: #e91e63;
--pink-dark: #d81b60;
--gray: #666666;
```

### Font:
- **Poppins** - Body text
- **Montserrat** - Headings

## 📱 Responsive Design

- **Desktop**: >= 1200px
- **Tablet**: 768px - 1199px  
- **Mobile**: < 768px

## 🔧 Development

### Thêm component mới:
1. Tạo file trong `src/components/`
2. Import và sử dụng trong `App.jsx`

### Thêm API endpoint:
1. Cập nhật `axios.defaults.baseURL` nếu cần
2. Tạo function trong component hoặc context

---

**Bloomora** - Pure blooms, pure joy 🌸

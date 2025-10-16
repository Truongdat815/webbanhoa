# Bloomora Backend

Node.js/Express API backend cho ứng dụng bán hoa tươi Bloomora.

## 🌸 Tính năng

- **Products API**: CRUD sản phẩm, tìm kiếm, lọc
- **Auth API**: Đăng nhập, đăng ký với JWT
- **Cart API**: Quản lý giỏ hàng
- **Orders API**: Xử lý đơn hàng
- **Categories API**: Danh mục sản phẩm

## 🚀 Cài đặt và chạy

### Yêu cầu
- Node.js >= 18
- npm

### Cài đặt
```bash
cd backend
npm install
```

### Chạy development
```bash
npm run dev
```

Backend sẽ chạy tại: http://localhost:8080

### Chạy production
```bash
npm start
```

## 🛠️ Công nghệ sử dụng

- **Express.js** - Web framework
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests
- **Multer** - File uploads

## 📁 Cấu trúc thư mục

```
backend/
├── server.js           # Main server file
├── config.js           # Configuration
├── package.json        # Dependencies
└── README.md          # Documentation
```

## 🔗 API Endpoints

### Health Check
- `GET /api/health` - Kiểm tra trạng thái server

### Products
- `GET /api/products` - Danh sách sản phẩm
- `GET /api/products/:id` - Chi tiết sản phẩm
- `GET /api/categories` - Danh mục sản phẩm

**Query parameters:**
- `category` - Lọc theo danh mục
- `search` - Tìm kiếm theo tên
- `sort` - Sắp xếp (price-asc, price-desc, name, discount)

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập

**Request body:**
```json
{
  "name": "Nguyễn Văn A",
  "email": "user@example.com", 
  "password": "password123"
}
```

### Cart
- `GET /api/cart/:userId` - Lấy giỏ hàng
- `POST /api/cart/:userId` - Thêm vào giỏ hàng
- `DELETE /api/cart/:userId/:productId` - Xóa khỏi giỏ hàng

### Orders
- `POST /api/orders` - Tạo đơn hàng mới
- `GET /api/orders/:userId` - Lấy đơn hàng của user

## 🔐 Authentication

API sử dụng JWT (JSON Web Token) cho authentication:

```javascript
// Header
Authorization: Bearer <token>
```

## 📊 Database

Hiện tại sử dụng in-memory storage (arrays). Để production, nên tích hợp với:
- MongoDB với Mongoose
- PostgreSQL với Sequelize
- MySQL với Prisma

## 🎯 Sample Data

Backend có sẵn dữ liệu mẫu:
- 8 sản phẩm hoa tươi
- 1 admin user (admin@bloomora.com / password)
- Các danh mục sản phẩm

## 🔧 Configuration

Cấu hình trong `config.js`:
- `PORT` - Port server (default: 8080)
- `JWT_SECRET` - Secret key cho JWT
- `NODE_ENV` - Environment

## 🚀 Deployment

### Environment Variables
```bash
PORT=8080
JWT_SECRET=your_secret_key
NODE_ENV=production
```

### Docker (tùy chọn)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
```

## 🔍 Testing

Test API endpoints với Postman hoặc curl:

```bash
# Health check
curl http://localhost:8080/api/health

# Get products
curl http://localhost:8080/api/products

# Register user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

## 📝 API Documentation

Chi tiết API documentation có thể tạo với Swagger/OpenAPI:

```bash
npm install swagger-jsdoc swagger-ui-express
```

---

**Bloomora** - Pure blooms, pure joy 🌸

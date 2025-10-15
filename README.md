# WebBanHoa - Flower Shop Website

Một website bán hoa tươi hoàn chỉnh với giao diện đẹp mắt và tính năng đầy đủ. Được xây dựng bằng HTML5, CSS3, JavaScript thuần và Bootstrap 5.

## 🌸 Tính năng chính

- **Trang chủ**: Slider hero, sản phẩm nổi bật, giao diện responsive
- **Danh mục sản phẩm**: Lọc theo danh mục, giá, sắp xếp
- **Chi tiết sản phẩm**: Thông tin chi tiết, sản phẩm liên quan
- **Giỏ hàng**: Thêm/xóa sản phẩm, cập nhật số lượng
- **Thanh toán**: Form đặt hàng hoàn chỉnh
- **Tài khoản**: Đăng ký, đăng nhập, quản lý thông tin
- **Dashboard**: Thống kê đơn hàng, lịch sử mua hàng
- **Responsive**: Tương thích mọi thiết bị

## 🚀 Cách chạy dự án

### 1. Tải dự án
```bash
# Clone hoặc tải về thư mục dự án
# Mở thư mục trong trình duyệt
```

### 2. Chạy local
```bash
# Cách 1: Mở trực tiếp file index.html trong trình duyệt
# Cách 2: Sử dụng Live Server (VS Code extension)
# Cách 3: Sử dụng Python HTTP server
python -m http.server 8000
# Sau đó truy cập: http://localhost:8000
```

### 3. Truy cập website
- **Trang chủ**: `index.html`
- **Sản phẩm**: `product-grid.html`
- **Chi tiết**: `product-detail.html`
- **Giỏ hàng**: `cart.html`
- **Thanh toán**: `checkout.html`
- **Đăng nhập**: `auth/login.html`
- **Đăng ký**: `auth/register.html`
- **Tài khoản**: `account/dashboard.html`

## 📁 Cấu trúc thư mục

```
webbanhoa/
├── index.html                 # Trang chủ
├── product-grid.html          # Danh mục sản phẩm
├── product-detail.html        # Chi tiết sản phẩm
├── cart.html                  # Giỏ hàng
├── checkout.html              # Thanh toán
├── auth/
│   ├── login.html            # Đăng nhập
│   └── register.html         # Đăng ký
├── account/
│   ├── dashboard.html        # Dashboard
│   ├── orders.html           # Đơn hàng
│   ├── profile.html          # Thông tin cá nhân
│   └── addresses.html        # Địa chỉ
├── css/
│   └── styles.css            # CSS chính
├── js/
│   └── scripts.js            # JavaScript chính
├── data/
│   ├── products.json         # Dữ liệu sản phẩm
│   └── users.json            # Dữ liệu người dùng
├── assets/
│   ├── logo.png              # Logo website
│   ├── placeholder-*.jpg     # Hình ảnh sản phẩm
│   └── hero-image-*.jpg      # Hình ảnh banner
└── README.md                 # Hướng dẫn này
```

## 🎨 Tùy chỉnh giao diện

### Thay đổi màu chính
Mở file `css/styles.css` và thay đổi các biến CSS:

```css
:root {
  --pink: #e91e63;           /* Màu chính */
  --pink-dark: #d81b60;      /* Màu đậm */
  --pink-light: #fce4ec;     /* Màu nhạt */
}
```

### Thay đổi logo
1. Thay thế file `assets/logo.png` bằng logo của bạn
2. Đảm bảo kích thước phù hợp (khuyến nghị: 200x60px)

### Thay đổi font chữ
Trong file `css/styles.css`:

```css
:root {
  --font-primary: 'Poppins', sans-serif;     /* Font chính */
  --font-heading: 'Montserrat', sans-serif;  /* Font tiêu đề */
}
```

### Thay đổi hình ảnh
1. **Hình sản phẩm**: Thay thế `assets/placeholder-*.jpg`
2. **Banner**: Thay thế `assets/hero-image-*.jpg`
3. **Logo**: Thay thế `assets/logo.png`

## 🔧 Tùy chỉnh dữ liệu

### Thêm/sửa sản phẩm
Chỉnh sửa file `data/products.json`:

```json
{
  "id": 1,
  "name": "Tên sản phẩm",
  "description": "Mô tả sản phẩm",
  "price": 150000,
  "salePrice": 120000,
  "discount": 20,
  "category": "love",
  "image": "assets/placeholder-1.jpg",
  "stock": 50,
  "rating": 4.8,
  "reviews": 128
}
```

### Thêm người dùng mẫu
Chỉnh sửa file `data/users.json`:

```json
{
  "id": 1,
  "firstName": "Tên",
  "lastName": "Họ",
  "email": "email@example.com",
  "password": "password123",
  "phone": "0123456789"
}
```

## 🔌 Tích hợp Backend

### API Endpoints cần thiết

#### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/logout` - Đăng xuất
- `GET /api/auth/me` - Thông tin user hiện tại

#### Products
- `GET /api/products` - Danh sách sản phẩm
- `GET /api/products/:id` - Chi tiết sản phẩm
- `GET /api/products/category/:category` - Sản phẩm theo danh mục

#### Cart & Orders
- `GET /api/cart` - Giỏ hàng
- `POST /api/cart/add` - Thêm vào giỏ
- `PUT /api/cart/update` - Cập nhật giỏ hàng
- `DELETE /api/cart/remove/:id` - Xóa khỏi giỏ
- `POST /api/orders` - Tạo đơn hàng
- `GET /api/orders` - Danh sách đơn hàng

#### User Management
- `GET /api/user/profile` - Thông tin cá nhân
- `PUT /api/user/profile` - Cập nhật thông tin
- `GET /api/user/addresses` - Danh sách địa chỉ
- `POST /api/user/addresses` - Thêm địa chỉ

### Thay thế Mock Data

Trong file `js/scripts.js`, thay thế các hàm mock bằng API calls:

```javascript
// Thay thế loadProducts()
async function loadProducts() {
  try {
    const response = await fetch('/api/products');
    products = await response.json();
    renderProductGrid();
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

// Thay thế login()
async function login(email, password) {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });
    
    if (response.ok) {
      const user = await response.json();
      currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
}
```

## 📱 Responsive Design

Website được thiết kế responsive với các breakpoints:

- **Desktop**: 1200px+
- **Tablet**: 992px - 1199px
- **Mobile**: 768px - 991px
- **Small Mobile**: < 768px

## 🔒 Bảo mật

### Lưu ý quan trọng
- Mật khẩu trong file `users.json` chỉ để demo
- Trong production, cần hash password
- Thêm validation phía server
- Sử dụng HTTPS
- Thêm CSRF protection

### Cải thiện bảo mật
```javascript
// Hash password trước khi lưu
function hashPassword(password) {
  // Sử dụng bcrypt hoặc crypto
  return bcrypt.hash(password, 10);
}

// Validate input
function validateInput(data) {
  // Thêm validation rules
  if (!data.email || !isValidEmail(data.email)) {
    throw new Error('Invalid email');
  }
}
```

## 🚀 Deployment

### GitHub Pages
1. Upload code lên GitHub repository
2. Vào Settings > Pages
3. Chọn source branch
4. Truy cập: `https://username.github.io/repository-name`

### Netlify
1. Kéo thả thư mục vào Netlify
2. Hoặc connect GitHub repository
3. Website sẽ tự động deploy

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Chạy: `vercel`
3. Follow instructions

## 🛠️ Công nghệ sử dụng

- **HTML5**: Semantic markup
- **CSS3**: Flexbox, Grid, Variables
- **JavaScript ES6+**: Modern JS features
- **Bootstrap 5**: UI framework
- **Swiper.js**: Slider library
- **Font Awesome**: Icons
- **Google Fonts**: Typography

## 📞 Hỗ trợ

Nếu có vấn đề hoặc cần hỗ trợ:

1. Kiểm tra Console (F12) để xem lỗi
2. Đảm bảo chạy qua HTTP server (không phải file://)
3. Kiểm tra đường dẫn file assets
4. Xem lại cấu trúc thư mục

## 📄 License

Dự án này được tạo cho mục đích học tập và demo. Bạn có thể sử dụng và tùy chỉnh theo nhu cầu.

---

**WebBanHoa** - Website bán hoa tươi chuyên nghiệp 🌸
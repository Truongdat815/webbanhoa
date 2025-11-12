# Website Sell Flower

## Frontend - Backend Communication

### Add to Cart AJAX Request

```javascript
const response = await fetch('/cart/add', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
        productId,
        quantity
    })
});
```

**Giải thích:**
- **Endpoint**: `/cart/add` - API để thêm sản phẩm vào giỏ hàng
- **Method**: `POST` - Gửi dữ liệu lên server
- **Content-Type**: `application/x-www-form-urlencoded` - Format dữ liệu như HTML form
- **Body**: `URLSearchParams` - Chuyển đổi object thành form data format
- **Parameters**: 
  - `productId`: ID của sản phẩm cần thêm
  - `quantity`: Số lượng sản phẩm

**Luồng hoạt động:**
1. **Frontend**: Thu thập thông tin sản phẩm và số lượng
2. **AJAX Request**: Gửi POST request với form data
3. **Backend**: `CartController.handleFormAddToCart()` xử lý request
4. **Response**: Server trả về JSON với status và message
5. **UI Update**: Frontend cập nhật giỏ hàng và hiển thị thông báo

**Response Format:**
```json
{
  "success": true/false,
  "message": "Thông báo",
  "cartCount": số_lượng_tổng
}
```

**Backend Handler:**
```java
@PostMapping("/cart/add")
@ResponseBody
public ResponseEntity<Map<String, Object>> handleFormAddToCart(
    @RequestParam Long productId,
    @RequestParam(defaultValue = "1") Integer quantity,
    HttpSession session
) {
    // Xử lý logic thêm vào giỏ hàng
    // Trả về JSON response
}
```

## Spring Boot Annotations

### @ResponseBody

`@ResponseBody` là một annotation quan trọng trong Spring MVC được sử dụng để **chuyển đổi giá trị trả về của method thành JSON/XML** thay vì trả về view template.

**Chức năng chính:**
- **Serialize object thành JSON**: Chuyển đổi Java object thành JSON string
- **Bypass View Resolution**: Không tìm kiếm template file, trả về data trực tiếp
- **Content-Type tự động**: Tự động set `Content-Type: application/json`
- **HTTP Response Body**: Đưa dữ liệu vào body của HTTP response

**Cách hoạt động:**
```java
// Không có @ResponseBody - trả về view template
@GetMapping("/admin/products")
public String products(Model model) {
    return "admin/products"; // Tìm file admin/products.html
}

// Có @ResponseBody - trả về JSON data
@GetMapping("/api/products")
@ResponseBody
public List<Product> getAllProducts() {
    return productService.findAllProducts(); // Trả về JSON array
}
```

**Ví dụ thực tế:**
```java
@PostMapping("/api/products")
@ResponseBody
public ResponseEntity<Map<String, Object>> createProduct(@RequestBody Product product) {
    Map<String, Object> response = new HashMap<>();
    response.put("success", true);
    response.put("message", "Tạo sản phẩm thành công");
    response.put("product", createdProduct);
    return ResponseEntity.ok(response);
}
```

**Kết quả HTTP Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "message": "Tạo sản phẩm thành công",
  "product": {
    "id": 1,
    "name": "Hoa hồng đỏ",
    "price": 50000
  }
}
```

**So sánh với @RestController:**
```java
// Cách 1: @Controller + @ResponseBody
@Controller
public class AdminController {
    @GetMapping("/api/products")
    @ResponseBody
    public List<Product> getProducts() { ... }
}

// Cách 2: @RestController (tự động có @ResponseBody)
@RestController
public class ApiController {
    @GetMapping("/api/products")
    public List<Product> getProducts() { ... } // Không cần @ResponseBody
}
```

**Khi nào sử dụng:**
- **API endpoints**: Trả về JSON cho AJAX calls
- **REST APIs**: Xây dựng RESTful web services
- **Mobile APIs**: Cung cấp data cho mobile apps
- **Single Page Applications**: Phục vụ frontend frameworks (React, Vue, Angular)

**Lưu ý quan trọng:**
- Phải có Jackson dependency trong classpath để serialize JSON
- Object trả về phải có getter methods hoặc public fields
- Sử dụng `ResponseEntity<T>` để control HTTP status code và headers

package org.example.website_sellflower.controller;

import org.example.website_sellflower.dto.CartItemDTO;
import org.example.website_sellflower.entity.Account;
import org.example.website_sellflower.entity.Order;
import org.example.website_sellflower.entity.OrderDetail;
import org.example.website_sellflower.entity.Product;
import org.example.website_sellflower.repository.AccountRepository;
import org.example.website_sellflower.repository.ProductRepository;
import org.example.website_sellflower.service.OrderDetailService;
import org.example.website_sellflower.service.OrderService;
import org.example.website_sellflower.util.OrderStatusUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/cart")
public class CartController {
    
    @Autowired(required = false)
    private ProductRepository productRepository;
    
    @Autowired(required = false)
    private OrderService orderService;
    
    @Autowired(required = false)
    private OrderDetailService orderDetailService;
    
    @Autowired(required = false)
    private AccountRepository accountRepository;
    
    @GetMapping
    public String showCartPage() {
        return "cart";
    }

    @PostMapping("/api/add")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> addToCart(
            @RequestParam Integer productId,
            @RequestParam String productName,
            @RequestParam BigDecimal price,
            @RequestParam Integer quantity,
            @RequestParam String imageUrl,
            @RequestParam(required = false) String stock,
            HttpSession session) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Get product stock from database (priority) or from request parameter
            Product product = null;
            Integer productStock = null;
            if (productRepository != null) {
                product = productRepository.findById(productId).orElse(null);
                productStock = product != null ? product.getStock() : null;
            }
            
            // Use stock from request if database stock is not available
            Integer stockValue = productStock;
            if (stockValue == null && stock != null && !stock.equals("null")) {
                try {
                    stockValue = Integer.parseInt(stock);
                } catch (NumberFormatException e) {
                    // Ignore invalid stock value
                }
            }
            
            List<CartItemDTO> cart = getCartFromSession(session);
            
            // Check if product already exists in cart
            CartItemDTO existingItem = cart.stream()
                    .filter(item -> item.getProductId().equals(productId))
                    .findFirst()
                    .orElse(null);
            
            int newQuantity = quantity;
            if (existingItem != null) {
                newQuantity = existingItem.getQuantity() + quantity;
            }
            
            // Validate stock
            if (stockValue != null && newQuantity > stockValue) {
                response.put("success", false);
                response.put("message", "Số lượng vượt quá tồn kho. Tồn kho hiện có: " + stockValue);
                return ResponseEntity.badRequest().body(response);
            }
            
            if (existingItem != null) {
                // Update quantity if product already exists
                existingItem.setQuantity(newQuantity);
                if (stockValue != null) {
                    existingItem.setStock(stockValue);
                }
            } else {
                // Add new item to cart
                CartItemDTO newItem = new CartItemDTO(productId, productName, price, quantity, imageUrl, stockValue);
                cart.add(newItem);
            }
            
            session.setAttribute("cart", cart);
            
            int totalItems = cart.stream().mapToInt(CartItemDTO::getQuantity).sum();
            
            response.put("success", true);
            response.put("message", "Đã thêm vào giỏ hàng");
            response.put("cartCount", totalItems);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Có lỗi xảy ra: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/api")
    @ResponseBody
    public ResponseEntity<List<CartItemDTO>> getCart(HttpSession session) {
        List<CartItemDTO> cart = getCartFromSession(session);
        // Update stock from database for each item
        if (productRepository != null) {
            for (CartItemDTO item : cart) {
                Product product = productRepository.findById(item.getProductId()).orElse(null);
                if (product != null) {
                    item.setStock(product.getStock());
                }
            }
        }
        return ResponseEntity.ok(cart);
    }

    @GetMapping("/api/count")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getCartCount(HttpSession session) {
        List<CartItemDTO> cart = getCartFromSession(session);
        int totalItems = cart.stream().mapToInt(CartItemDTO::getQuantity).sum();
        
        Map<String, Object> response = new HashMap<>();
        response.put("count", totalItems);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/api/update")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> updateCartItem(
            @RequestParam Integer productId,
            @RequestParam Integer quantity,
            HttpSession session) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Get product stock from database
            Product product = null;
            Integer stock = null;
            if (productRepository != null) {
                product = productRepository.findById(productId).orElse(null);
                stock = product != null ? product.getStock() : null;
            }
            
            // Validate stock
            if (stock != null && quantity > stock) {
                response.put("success", false);
                response.put("message", "Số lượng vượt quá tồn kho. Tồn kho hiện có: " + stock);
                return ResponseEntity.badRequest().body(response);
            }
            
            List<CartItemDTO> cart = getCartFromSession(session);
            
            CartItemDTO item = cart.stream()
                    .filter(cartItem -> cartItem.getProductId().equals(productId))
                    .findFirst()
                    .orElse(null);
            
            if (item != null) {
                if (quantity <= 0) {
                    cart.remove(item);
                } else {
                    item.setQuantity(quantity);
                    if (stock != null) {
                        item.setStock(stock);
                    }
                }
                session.setAttribute("cart", cart);
                
                int totalItems = cart.stream().mapToInt(CartItemDTO::getQuantity).sum();
                response.put("success", true);
                response.put("cartCount", totalItems);
            } else {
                response.put("success", false);
                response.put("message", "Không tìm thấy sản phẩm trong giỏ hàng");
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Có lỗi xảy ra: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/api/remove/{productId}")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> removeCartItem(
            @PathVariable Integer productId,
            HttpSession session) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<CartItemDTO> cart = getCartFromSession(session);
            cart.removeIf(item -> item.getProductId().equals(productId));
            session.setAttribute("cart", cart);
            
            int totalItems = cart.stream().mapToInt(CartItemDTO::getQuantity).sum();
            
            response.put("success", true);
            response.put("cartCount", totalItems);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Có lỗi xảy ra: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/api/clear")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> clearCart(HttpSession session) {
        session.removeAttribute("cart");
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Đã xóa giỏ hàng");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/api/checkout")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> checkout(HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Check if user is logged in
            Boolean isLoggedIn = (Boolean) session.getAttribute("isLoggedIn");
            if (isLoggedIn == null || !isLoggedIn) {
                response.put("success", false);
                response.put("message", "Vui lòng đăng nhập để đặt hàng");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Get cart items
            List<CartItemDTO> cart = getCartFromSession(session);
            if (cart == null || cart.isEmpty()) {
                response.put("success", false);
                response.put("message", "Giỏ hàng của bạn đang trống!");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Get account from session
            Integer accountId = (Integer) session.getAttribute("accountId");
            if (accountId == null) {
                response.put("success", false);
                response.put("message", "Không tìm thấy thông tin tài khoản");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Get account entity
            Account account = null;
            if (accountRepository != null) {
                account = accountRepository.findById(accountId).orElse(null);
            }
            if (account == null && accountRepository == null) {
                // If repository is not available, create a temporary account object
                account = new Account();
                account.setAccountId(accountId);
                account.setName((String) session.getAttribute("accountName"));
                account.setEmail((String) session.getAttribute("accountEmail"));
            }
            
            if (account == null) {
                response.put("success", false);
                response.put("message", "Không tìm thấy thông tin tài khoản");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Calculate total amount
            BigDecimal totalAmount = BigDecimal.ZERO;
            for (CartItemDTO item : cart) {
                BigDecimal itemTotal = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                totalAmount = totalAmount.add(itemTotal);
            }
            
            // Add shipping fee (15,000 VND)
            BigDecimal shippingFee = new BigDecimal("15000");
            totalAmount = totalAmount.add(shippingFee);
            
            // Create Order
            Order order = new Order();
            order.setAccount(account);
            order.setOrderDate(LocalDateTime.now());
            order.setTotalAmount(totalAmount);
            order.setStatus(OrderStatusUtil.PENDING_PAYMENT); // Status in English for database
            order.setNote(null);
            
            // Save order
            if (orderService != null) {
                order = orderService.createOrder(order);
            } else {
                response.put("success", false);
                response.put("message", "Dịch vụ đặt hàng chưa sẵn sàng");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (order == null || order.getOrderId() == null) {
                response.put("success", false);
                response.put("message", "Không thể tạo đơn hàng. Vui lòng thử lại.");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Create OrderDetails
            if (orderDetailService != null && productRepository != null) {
                for (CartItemDTO item : cart) {
                    Product product = productRepository.findById(item.getProductId()).orElse(null);
                    if (product != null) {
                        OrderDetail orderDetail = new OrderDetail();
                        orderDetail.setOrder(order);
                        orderDetail.setProduct(product);
                        orderDetail.setQuantity(item.getQuantity());
                        BigDecimal itemTotal = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                        orderDetail.setTotal(itemTotal);
                        orderDetailService.saveOrderDetail(orderDetail);
                    }
                }
            }
            
            // Clear cart after successful checkout
            session.removeAttribute("cart");
            
            response.put("success", true);
            response.put("message", "Đặt hàng thành công!");
            response.put("orderId", order.getOrderId());
            response.put("cartCount", 0);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Có lỗi xảy ra khi xử lý đơn hàng: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @SuppressWarnings("unchecked")
    private List<CartItemDTO> getCartFromSession(HttpSession session) {
        List<CartItemDTO> cart = (List<CartItemDTO>) session.getAttribute("cart");
        if (cart == null) {
            cart = new ArrayList<>();
            session.setAttribute("cart", cart);
        }
        return cart;
    }
}

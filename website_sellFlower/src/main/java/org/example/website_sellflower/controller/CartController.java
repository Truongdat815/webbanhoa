// File: src/main/java/org/example/website_sellflower/controller/CartController.java
package org.example.website_sellflower.controller;

import jakarta.servlet.http.HttpSession;
import org.example.website_sellflower.entity.Account;
import org.example.website_sellflower.entity.CartItem;
import org.example.website_sellflower.entity.Order;
import org.example.website_sellflower.entity.OrderDetail;
import org.example.website_sellflower.entity.Product;
import org.example.website_sellflower.service.CartService;
import org.example.website_sellflower.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private OrderService orderService;

    @GetMapping
    public String showCartPage(Model model, HttpSession session) {
        Account account = (Account) session.getAttribute("account");
        if (account == null) {
            return "redirect:/login";
        }
        model.addAttribute("isLoggedIn", true);
        model.addAttribute("userDisplayName", account.getFullName() != null ? account.getFullName() : account.getUsername());
        return "cart";
    }

    // API: Get cart items
    @GetMapping("/api")
    @ResponseBody
    public ResponseEntity<List<Map<String, Object>>> getCartItems(HttpSession session) {
        Account account = (Account) session.getAttribute("account");
        if (account == null) {
            return ResponseEntity.status(401).build();
        }

        List<CartItem> cartItems = cartService.getCartItems(account.getId());
        List<Map<String, Object>> result = new ArrayList<>();

        for (CartItem item : cartItems) {
            Map<String, Object> itemMap = new HashMap<>();
            itemMap.put("productId", item.getProduct().getId());
            itemMap.put("productName", item.getProduct().getName());
            itemMap.put("price", item.getPrice());
            itemMap.put("quantity", item.getQuantity());
            itemMap.put("imageUrl", item.getProduct().getImageUrl());
            itemMap.put("stock", item.getProduct().getStockQuantity());
            result.add(itemMap);
        }

        return ResponseEntity.ok(result);
    }

    // API: Get cart count
    @GetMapping("/api/count")
    @ResponseBody
    public ResponseEntity<Map<String, Integer>> getCartCount(HttpSession session) {
        Account account = (Account) session.getAttribute("account");
        if (account == null) {
            Map<String, Integer> response = new HashMap<>();
            response.put("count", 0);
            return ResponseEntity.ok(response);
        }

        int count = cartService.getCartItemCount(account.getId());
        Map<String, Integer> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }

    // API: Add to cart
    @PostMapping("/add")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> addToCart(
            @RequestParam("productId") Long productId,
            @RequestParam("quantity") Integer quantity,
            HttpSession session) {

        Map<String, Object> response = new HashMap<>();
        Account account = (Account) session.getAttribute("account");

        if (account == null) {
            response.put("success", false);
            response.put("message", "Vui lòng đăng nhập!");
            return ResponseEntity.status(401).body(response);
        }

        try {
            cartService.addItemToCart(account.getId(), productId, quantity);
            int cartCount = cartService.getCartItemCount(account.getId());

            response.put("success", true);
            response.put("message", "Đã thêm vào giỏ hàng!");
            response.put("cartCount", cartCount);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // API: Update cart item quantity
    @PutMapping("/api/update")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> updateCartItem(
            @RequestParam("productId") Long productId,
            @RequestParam("quantity") Integer quantity,
            HttpSession session) {

        Map<String, Object> response = new HashMap<>();
        Account account = (Account) session.getAttribute("account");

        if (account == null) {
            response.put("success", false);
            response.put("message", "Vui lòng đăng nhập!");
            return ResponseEntity.status(401).body(response);
        }

        try {
            cartService.updateCartItemQuantity(account.getId(), productId, quantity);
            int cartCount = cartService.getCartItemCount(account.getId());

            response.put("success", true);
            response.put("message", "Đã cập nhật giỏ hàng!");
            response.put("cartCount", cartCount);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // API: Remove cart item
    @DeleteMapping("/api/remove/{productId}")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> removeCartItem(
            @PathVariable Long productId,
            HttpSession session) {

        Map<String, Object> response = new HashMap<>();
        Account account = (Account) session.getAttribute("account");

        if (account == null) {
            response.put("success", false);
            response.put("message", "Vui lòng đăng nhập!");
            return ResponseEntity.status(401).body(response);
        }

        try {
            cartService.removeItemFromCart(account.getId(), productId);
            int cartCount = cartService.getCartItemCount(account.getId());

            response.put("success", true);
            response.put("message", "Đã xóa sản phẩm khỏi giỏ hàng!");
            response.put("cartCount", cartCount);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // API: Clear cart
    @PostMapping("/api/clear")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> clearCart(HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        Account account = (Account) session.getAttribute("account");

        if (account == null) {
            response.put("success", false);
            response.put("message", "Vui lòng đăng nhập!");
            return ResponseEntity.status(401).body(response);
        }

        try {
            cartService.clearCart(account.getId());
            response.put("success", true);
            response.put("message", "Đã xóa giỏ hàng!");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // API: Checkout (Create Order)
    @PostMapping("/api/checkout")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> checkout(HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        Account account = (Account) session.getAttribute("account");

        if (account == null) {
            response.put("success", false);
            response.put("message", "Vui lòng đăng nhập!");
            return ResponseEntity.status(401).body(response);
        }

        try {
            // Check if account has address and phone
            if (account.getAddress() == null || account.getAddress().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Vui lòng cập nhật địa chỉ giao hàng trong tài khoản!");
                return ResponseEntity.badRequest().body(response);
            }

            if (account.getPhone() == null || account.getPhone().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Vui lòng cập nhật số điện thoại trong tài khoản!");
                return ResponseEntity.badRequest().body(response);
            }

            // Get cart items
            List<CartItem> cartItems = cartService.getCartItems(account.getId());

            if (cartItems.isEmpty()) {
                response.put("success", false);
                response.put("message", "Giỏ hàng trống!");
                return ResponseEntity.badRequest().body(response);
            }

            // Create Order
            Order order = new Order();
            order.setAccount(account);
            order.setOrderDate(LocalDateTime.now());
            order.setStatus("processing"); // Đang được vận chuyển
            order.setShippingAddress(account.getAddress());
            order.setPhone(account.getPhone());

            // Calculate total
            double totalAmount = 0;
            List<OrderDetail> orderDetails = new ArrayList<>();

            for (CartItem cartItem : cartItems) {
                // Check stock before creating order
                Product product = cartItem.getProduct();
                if (product.getStockQuantity() != null && cartItem.getQuantity() > product.getStockQuantity()) {
                    response.put("success", false);
                    response.put("message", "Sản phẩm \"" + product.getName() + "\" không đủ hàng trong kho!");
                    return ResponseEntity.badRequest().body(response);
                }

                OrderDetail detail = new OrderDetail();
                detail.setOrder(order);
                detail.setProduct(product);
                detail.setQuantity(cartItem.getQuantity());
                detail.setPrice(cartItem.getPrice());
                orderDetails.add(detail);

                totalAmount += cartItem.getPrice() * cartItem.getQuantity();
            }

            // Add shipping fee
            double shippingFee = 15000.0; // 15,000 VND
            totalAmount += shippingFee;

            order.setTotalAmount(totalAmount);
            order.setOrderDetails(orderDetails);

            // Save Order
            Order createdOrder = orderService.createOrder(order);

            // Clear cart after successful checkout
            cartService.clearCart(account.getId());

            response.put("success", true);
            response.put("message", "Đã đặt hàng thành công!");
            response.put("orderId", createdOrder.getId());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Lỗi: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
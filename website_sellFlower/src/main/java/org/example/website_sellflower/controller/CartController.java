package org.example.website_sellflower.controller;

import org.example.website_sellflower.dto.CartItemDTO;
import org.example.website_sellflower.entity.Product;
import org.example.website_sellflower.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/cart")
public class CartController {
    
    @Autowired(required = false)
    private ProductRepository productRepository;
    
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
            if (stock != null && newQuantity > stock) {
                response.put("success", false);
                response.put("message", "Số lượng vượt quá tồn kho. Tồn kho hiện có: " + stock);
                return ResponseEntity.badRequest().body(response);
            }
            
            if (existingItem != null) {
                // Update quantity if product already exists
                existingItem.setQuantity(newQuantity);
                if (stock != null) {
                    existingItem.setStock(stock);
                }
            } else {
                // Add new item to cart
                CartItemDTO newItem = new CartItemDTO(productId, productName, price, quantity, imageUrl, stock);
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

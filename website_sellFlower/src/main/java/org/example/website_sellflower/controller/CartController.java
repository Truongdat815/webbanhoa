package org.example.website_sellflower.controller;

import jakarta.servlet.http.HttpSession;
import org.example.website_sellflower.entity.OrderDetail;
import org.example.website_sellflower.entity.Product;
import org.example.website_sellflower.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/cart")
public class CartController {

    @Autowired
    ProductService productService;
    @GetMapping
    public String showCartPage(Model model, HttpSession session) {
        if (session.getAttribute("account") == null) {
            return "redirect:/login";
        }
        model.addAttribute("isLoggedIn", true);
        return "cart";
    }

    @PostMapping("/add")
    @ResponseBody
    public Map<String, Object> addToCart(@RequestParam("productId") Long productId, @RequestParam("quantity") Integer quantity, HttpSession session) {
        Map<String, Object> response = new HashMap<>();

        if (session.getAttribute("account") == null) {
            response.put("success", false);
            response.put("message", "Vui lòng đăng nhập!");
            return response;
        }

        Product product = productService.findProductById(productId);
        if (product == null) {
            response.put("success", false);
            response.put("message", "Sản phẩm không tồn tại!");
            return response;
        }

        if (product.getStockQuantity() != null && quantity > product.getStockQuantity()) {
            response.put("success", false);
            response.put("message", "Vượt tồn kho!");
            return response;
        }

        @SuppressWarnings("unchecked")
        List<OrderDetail> cart = (List<OrderDetail>) session.getAttribute("cart");
        if (cart == null) cart = new ArrayList<>();

        boolean found = false;
        for (OrderDetail item : cart) {
            if (item.getProduct().getId().equals(productId)) {
                int newQty = item.getQuantity() + quantity;
                if (product.getStockQuantity() != null && newQty > product.getStockQuantity()) {
                    response.put("success", false);
                    response.put("message", "Vượt tồn kho sau khi cộng!");
                    return response;
                }
                item.setQuantity(newQty);
                found = true;
                break;
            }
        }

        if (!found) {
            OrderDetail newItem = new OrderDetail();
            newItem.setProduct(product);  // Sử dụng full product
            newItem.setQuantity(quantity);
            cart.add(newItem);
        }

        session.setAttribute("cart", cart);
        response.put("success", true);
        response.put("message", "Đã thêm!");
        response.put("cartCount", cart.stream().mapToInt(OrderDetail::getQuantity).sum());  // Tổng qty

        return response;
    }


    

}
package org.example.website_sellflower.controller;

import jakarta.servlet.http.HttpSession;
import org.example.website_sellflower.entity.Account;
import org.example.website_sellflower.entity.Order;
import org.example.website_sellflower.service.AccountService;
import org.example.website_sellflower.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/account")
public class AccountController {
    
    @Autowired
    private AccountService accountService;
    
    @Autowired
    private OrderService orderService;
    
    @GetMapping
    public String showAccount(HttpSession session, Model model){
        // Lấy email từ session
        String email = (String) session.getAttribute("username");
        if (email != null && accountService != null) {
            // Load account từ database
            Account account = accountService.getAccountByEmail(email);
            if (account != null) {
                // Truyền account vào model
                model.addAttribute("account", account);
                model.addAttribute("accountName", account.getName());
                model.addAttribute("accountEmail", account.getEmail());
                model.addAttribute("accountPhone", account.getPhone());
                model.addAttribute("accountAddress", account.getAddress());
                
                // Load orders từ database
                if (orderService != null && account.getAccountId() != null) {
                    List<Order> orders = orderService.getOrdersByAccountId(account.getAccountId());
                    
                    // Process orders để format status và tạo status class map
                    Map<Integer, String> orderStatusClassMap = orders.stream()
                            .collect(Collectors.toMap(
                                    Order::getOrderId,
                                    order -> getStatusClass(order.getStatus())
                            ));
                    
                    model.addAttribute("orders", orders);
                    model.addAttribute("orderStatusClassMap", orderStatusClassMap);
                    
                    // Tính toán thống kê
                    int totalOrders = orders.size();
                    BigDecimal totalSpending = orders.stream()
                            .map(Order::getTotalAmount)
                            .filter(amount -> amount != null)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    
                    model.addAttribute("totalOrders", totalOrders);
                    model.addAttribute("totalSpending", totalSpending);
                    
                    // Lấy 5 đơn hàng gần nhất với status class
                    List<Order> recentOrders = orders.stream()
                            .limit(5)
                            .toList();
                    Map<Integer, String> recentOrderStatusClassMap = recentOrders.stream()
                            .collect(Collectors.toMap(
                                    Order::getOrderId,
                                    order -> getStatusClass(order.getStatus())
                            ));
                    model.addAttribute("recentOrders", recentOrders);
                    model.addAttribute("recentOrderStatusClassMap", recentOrderStatusClassMap);
                } else {
                    model.addAttribute("orders", List.of());
                    model.addAttribute("orderStatusClassMap", new HashMap<>());
                    model.addAttribute("totalOrders", 0);
                    model.addAttribute("totalSpending", BigDecimal.ZERO);
                    model.addAttribute("recentOrders", List.of());
                    model.addAttribute("recentOrderStatusClassMap", new HashMap<>());
                }
            }
        }
        return "account";
    }
    
    /**
     * Convert order status to CSS class name
     * @param status Order status from database
     * @return CSS class name for status badge
     */
    private String getStatusClass(String status) {
        if (status == null || status.isEmpty()) {
            return "pending";
        }
        
        // Normalize status: convert to lowercase and replace spaces/special chars with hyphens
        String normalized = status.toLowerCase()
                .replace(" ", "-")
                .replace("_", "-")
                .replace("đã", "")
                .replace("chờ", "pending")
                .replace("đang", "processing")
                .replace("hoàn-thành", "completed")
                .replace("đã-giao", "delivered")
                .replace("đã-hủy", "cancelled")
                .replace("tạm-giữ", "on-hold")
                .replace("đã-duyệt", "approved");
        
        // Map common Vietnamese statuses to CSS classes
        if (status.contains("Hoàn thành") || status.contains("completed") || status.equalsIgnoreCase("delivered")) {
            return "completed";
        } else if (status.contains("Đang xử lý") || status.contains("processing")) {
            return "processing";
        } else if (status.contains("Chờ") || status.contains("pending")) {
            return "pending";
        } else if (status.contains("Đã duyệt") || status.contains("approved")) {
            return "approved";
        } else if (status.contains("Tạm giữ") || status.contains("on-hold")) {
            return "on-hold";
        } else if (status.contains("Đã hủy") || status.contains("cancelled")) {
            return "cancelled";
        }
        
        return normalized;
    }
}

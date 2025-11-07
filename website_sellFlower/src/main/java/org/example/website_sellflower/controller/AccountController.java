package org.example.website_sellflower.controller;

import jakarta.servlet.http.HttpSession;
import org.example.website_sellflower.entity.Order;
import org.example.website_sellflower.service.AccountService;
import org.example.website_sellflower.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/account")
public class AccountController {
    
    @Autowired(required = false)
    private ReviewService reviewService;
    
    @Autowired(required = false)
    private AccountService accountService;
    
    @GetMapping
    public String showAccount(HttpSession session, Model model){
        // Hardcode dữ liệu - không cần session
        Integer accountId = 1; // Hardcode accountId để dùng cho orders và reviews
        
        // Lấy số lượng đánh giá (hardcode)
        long reviewCount = 3; // Hardcode số lượng đánh giá
        
        // Hardcode danh sách đơn hàng - không cần database
        List<Order> orders = getHardcodedOrders(accountId);
        
        // Format dữ liệu đơn hàng để hiển thị
        List<OrderDisplay> orderDisplays = new ArrayList<>();
        for (Order order : orders) {
            OrderDisplay display = new OrderDisplay();
            display.setOrderId(order.getOrderId());
            display.setFormattedDate(formatDate(order.getOrderDate()));
            display.setStatus(order.getStatus());
            display.setStatusClass(getStatusClass(order.getStatus()));
            display.setFormattedAmount(formatAmount(order.getTotalAmount()));
            orderDisplays.add(display);
        }
        
        // Truyền vào model (chỉ những gì cần thiết cho các phần khác)
        model.addAttribute("reviewCount", reviewCount);
        model.addAttribute("orders", orderDisplays);
        
        // Note: Flash attributes (success/error) are automatically added by Spring MVC
        // They will be available in the model if they exist
        
        return "account";
    }
    
    // Hardcode danh sách đơn hàng để test - không cần database
    private List<Order> getHardcodedOrders(Integer accountId) {
        List<Order> orders = new ArrayList<>();
        
        // Đơn hàng 1 - Hoàn thành
        Order order1 = new Order();
        order1.setOrderId(1);
        order1.setOrderDate(LocalDateTime.of(2024, 1, 15, 10, 30));
        order1.setTotalAmount(new BigDecimal("450000"));
        order1.setStatus("Hoàn thành");
        orders.add(order1);
        
        // Đơn hàng 2 - Đang xử lý
        Order order2 = new Order();
        order2.setOrderId(2);
        order2.setOrderDate(LocalDateTime.of(2024, 1, 10, 14, 20));
        order2.setTotalAmount(new BigDecimal("320000"));
        order2.setStatus("Đang xử lý");
        orders.add(order2);
        
        // Đơn hàng 3 - Chờ xử lý
        Order order3 = new Order();
        order3.setOrderId(3);
        order3.setOrderDate(LocalDateTime.of(2024, 1, 5, 9, 15));
        order3.setTotalAmount(new BigDecimal("280000"));
        order3.setStatus("Chờ xử lý");
        orders.add(order3);
        
        // Đơn hàng 4 - Đã duyệt
        Order order4 = new Order();
        order4.setOrderId(4);
        order4.setOrderDate(LocalDateTime.of(2023, 12, 22, 16, 45));
        order4.setTotalAmount(new BigDecimal("550000"));
        order4.setStatus("Đã duyệt");
        orders.add(order4);
        
        // Đơn hàng 5 - Tạm giữ
        Order order5 = new Order();
        order5.setOrderId(5);
        order5.setOrderDate(LocalDateTime.of(2023, 12, 18, 11, 30));
        order5.setTotalAmount(new BigDecimal("190000"));
        order5.setStatus("Tạm giữ");
        orders.add(order5);
        
        return orders;
    }
    
    // Helper method để lấy status class
    public static String getStatusClass(String status) {
        if (status == null) {
            return "default";
        }
        String statusLower = status.toLowerCase();
        if (statusLower.contains("hoàn thành") || statusLower.contains("completed")) {
            return "completed";
        } else if (statusLower.contains("đang xử lý") || statusLower.contains("processing")) {
            return "processing";
        } else if (statusLower.contains("chờ xử lý") || statusLower.contains("pending")) {
            return "pending";
        } else if (statusLower.contains("đã duyệt") || statusLower.contains("approved")) {
            return "approved";
        } else if (statusLower.contains("tạm giữ") || statusLower.contains("on hold")) {
            return "on-hold";
        }
        return "default";
    }
    
    // Helper method để format số tiền
    public static String formatAmount(BigDecimal amount) {
        if (amount == null) {
            return "0₫";
        }
        return String.format("%,d₫", amount.intValue());
    }
    
    // Helper method để format ngày tháng
    public static String formatDate(LocalDateTime date) {
        if (date == null) {
            return "N/A";
        }
        return String.format("%02d/%02d/%04d", date.getDayOfMonth(), date.getMonthValue(), date.getYear());
    }
    
    // Inner class để hiển thị đơn hàng
    public static class OrderDisplay {
        private Integer orderId;
        private String formattedDate;
        private String status;
        private String statusClass;
        private String formattedAmount;
        
        public Integer getOrderId() {
            return orderId;
        }
        
        public void setOrderId(Integer orderId) {
            this.orderId = orderId;
        }
        
        public String getFormattedDate() {
            return formattedDate;
        }
        
        public void setFormattedDate(String formattedDate) {
            this.formattedDate = formattedDate;
        }
        
        public String getStatus() {
            return status;
        }
        
        public void setStatus(String status) {
            this.status = status;
        }
        
        public String getStatusClass() {
            return statusClass;
        }
        
        public void setStatusClass(String statusClass) {
            this.statusClass = statusClass;
        }
        
        public String getFormattedAmount() {
            return formattedAmount;
        }
        
        public void setFormattedAmount(String formattedAmount) {
            this.formattedAmount = formattedAmount;
        }
    }
}

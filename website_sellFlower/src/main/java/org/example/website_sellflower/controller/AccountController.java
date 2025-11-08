package org.example.website_sellflower.controller;

import jakarta.servlet.http.HttpSession;
import org.example.website_sellflower.entity.Account;
import org.example.website_sellflower.entity.Order;
import org.example.website_sellflower.service.AccountService;
import org.example.website_sellflower.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/account")
public class AccountController {
    @Autowired
    private AccountService accountService;

    @Autowired
    private OrderService orderService;

    @GetMapping
    public String showAccount(){
        return "account";
    }

    // API: Lấy thông tin account đang đăng nhập
    @GetMapping("/api/info")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getAccountInfo(HttpSession session) {
        Long accountId = (Long) session.getAttribute("accountId");
        if (accountId == null) {
            return ResponseEntity.status(401).build();
        }

        Account account = accountService.findById(accountId);
        if (account == null) {
            return ResponseEntity.notFound().build();
        }

        Map<String, Object> response = new HashMap<>();
        response.put("id", account.getId());
        response.put("username", account.getUsername());
        response.put("fullName", account.getFullName());
        response.put("email", account.getEmail());
        response.put("phone", account.getPhone());
        response.put("address", account.getAddress());

        return ResponseEntity.ok(response);
    }

    // API: Lấy danh sách đơn hàng của user (cho Account Overview)
    @GetMapping("/api/orders")
    @ResponseBody
    public ResponseEntity<List<Order>> getAccountOrders(HttpSession session) {
        Long accountId = (Long) session.getAttribute("accountId");
        if (accountId == null) {
            return ResponseEntity.status(401).build();
        }

        List<Order> orders = orderService.findByAccountId(accountId);
        return ResponseEntity.ok(orders);
    }

    // API: Tính tổng chi tiêu và reward points
    @GetMapping("/api/stats")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getAccountStats(HttpSession session) {
        Long accountId = (Long) session.getAttribute("accountId");
        if (accountId == null) {
            return ResponseEntity.status(401).build();
        }

        List<Order> orders = orderService.findByAccountId(accountId);

        double totalSpending = orders.stream()
                .mapToDouble(Order::getTotalAmount)
                .sum();

        int rewardPoints = (int) (totalSpending / 1000); // Mỗi 1000đ = 1 điểm

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalOrders", orders.size());
        stats.put("totalSpending", totalSpending);
        stats.put("rewardPoints", rewardPoints);

        return ResponseEntity.ok(stats);
    }
}
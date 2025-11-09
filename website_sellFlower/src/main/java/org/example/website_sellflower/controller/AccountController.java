package org.example.website_sellflower.controller;

import jakarta.servlet.http.HttpSession;
import org.example.website_sellflower.entity.Account;
import org.example.website_sellflower.entity.Order;
import org.example.website_sellflower.service.AccountService;
import org.example.website_sellflower.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

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
    public String showAccount(Model model, HttpSession session) {
        Account account = (Account) session.getAttribute("account");
        if (account == null) {
            return "redirect:/login";
        }

        // Get account info
        Account accountDetails = accountService.findById(account.getId());
        if (accountDetails == null) {
            return "redirect:/login";
        }

        // Get orders
        List<Order> orders = orderService.findByAccountId(account.getId());

        // Calculate stats
        double totalSpending = orders.stream()
                .mapToDouble(order -> order.getTotalAmount() != null ? order.getTotalAmount() : 0.0)
                .sum();
        int rewardPoints = (int) (totalSpending / 1000); // Mỗi 1000đ = 1 điểm

        // Get recent orders (last 5)
        List<Order> recentOrders = orders.stream()
                .sorted((o1, o2) -> {
                    if (o1.getOrderDate() == null) return 1;
                    if (o2.getOrderDate() == null) return -1;
                    return o2.getOrderDate().compareTo(o1.getOrderDate());
                })
                .limit(5)
                .collect(Collectors.toList());

        // Create status maps for template
        Map<Long, String> orderStatusClassMap = orders.stream()
                .collect(Collectors.toMap(
                        Order::getId,
                        order -> getStatusClass(order.getStatus())
                ));

        Map<Long, String> recentOrderStatusClassMap = recentOrders.stream()
                .collect(Collectors.toMap(
                        Order::getId,
                        order -> getStatusClass(order.getStatus())
                ));

        // Add to model
        model.addAttribute("account", accountDetails);
        model.addAttribute("isLoggedIn", true);
        model.addAttribute("userDisplayName", accountDetails.getFullName());
        model.addAttribute("accountName", accountDetails.getFullName());
        model.addAttribute("accountEmail", accountDetails.getEmail());
        model.addAttribute("accountPhone", accountDetails.getPhone());
        model.addAttribute("accountAddress", accountDetails.getAddress());
        model.addAttribute("orders", orders);
        model.addAttribute("recentOrders", recentOrders);
        model.addAttribute("totalOrders", orders.size());
        model.addAttribute("totalSpending", totalSpending);
        model.addAttribute("rewardPoints", rewardPoints);
        model.addAttribute("orderStatusClassMap", orderStatusClassMap);
        model.addAttribute("recentOrderStatusClassMap", recentOrderStatusClassMap);

        return "account";
    }

    private String getStatusClass(String status) {
        if (status == null) return "pending";
        return switch (status) {
            case "pending_payment" -> "pending";
            case "paid" -> "approved";
            case "processing" -> "processing";
            case "shipped" -> "on-hold";
            case "delivered" -> "completed";
            case "cancelled" -> "cancelled";
            default -> "pending";
        };
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
package org.example.website_sellflower.controller;

import jakarta.servlet.http.HttpSession;
import org.example.website_sellflower.entity.Account;
import org.example.website_sellflower.entity.Order;
import org.example.website_sellflower.entity.OrderDetail;
import org.example.website_sellflower.entity.Product;
import org.example.website_sellflower.service.AccountService;
import org.example.website_sellflower.service.OrderService;
import org.example.website_sellflower.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.time.temporal.WeekFields;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;

@Controller
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private ProductService productService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private AccountService accountService;

    // Kiểm tra quyền ADMIN
    private boolean isAdmin(HttpSession session) {
        Account account = (Account) session.getAttribute("account");
        return account != null && "ADMIN".equals(account.getRole()) && "ACTIVE".equals(account.getStatus());
    }

    // Redirect nếu không phải admin
    private String checkAdminAndRedirect(HttpSession session) {
        if (!isAdmin(session)) {
            return "redirect:/login?error=Không có quyền truy cập";
        }
        return null;
    }

    // ==================== DASHBOARD ====================
    @GetMapping
    public String dashboard(HttpSession session, Model model) {
        String redirect = checkAdminAndRedirect(session);
        if (redirect != null) return redirect;

        Account account = (Account) session.getAttribute("account");
        model.addAttribute("isLoggedIn", true);
        model.addAttribute("userDisplayName", account.getFullName());
        model.addAttribute("isAdmin", true);

        Map<String, Object> dashboardStats = buildDashboardStats();
        model.addAttribute("dashboardStats", dashboardStats);

        Map<String, Object> totals = (Map<String, Object>) dashboardStats.getOrDefault("totals", new HashMap<>());
        model.addAttribute("totalProducts", ((Number) totals.getOrDefault("products", 0)).intValue());
        model.addAttribute("totalOrders", ((Number) totals.getOrDefault("orders", 0)).longValue());
        model.addAttribute("totalAccounts", ((Number) totals.getOrDefault("accounts", 0)).longValue());
        model.addAttribute("totalRevenue", ((Number) totals.getOrDefault("revenue", 0)).doubleValue());

        return "admin/dashboard";
    }

    @GetMapping("/api/dashboard")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getDashboardStats(HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(buildDashboardStats());
    }

    private Map<String, Object> buildDashboardStats() {
        Map<String, Object> data = new HashMap<>();

        List<Product> products = productService.findAllProducts();
        List<Account> accounts = accountService.findAllAccounts();
        List<Order> orders = orderService.getAllOrders();

        int productCount = products != null ? products.size() : 0;
        long accountCount = accounts != null ? accounts.size() : 0;
        long orderCount = orderService.countOrders();
        double totalRevenue = orderService.getTotalRevenue();

        Map<String, Object> totals = new HashMap<>();
        totals.put("products", productCount);
        totals.put("orders", orderCount);
        totals.put("accounts", accountCount);
        totals.put("revenue", totalRevenue);
        data.put("totals", totals);
        data.put("products", productCount);
        data.put("orders", orderCount);
        data.put("accounts", accountCount);
        data.put("revenue", totalRevenue);

        Map<String, Object> totalsChart = new HashMap<>();
        totalsChart.put("labels", List.of("Sản phẩm", "Tài khoản"));
        totalsChart.put("values", List.of(productCount, (int) accountCount));
        data.put("totalsChart", totalsChart);

        data.put("revenueBreakdown", buildRevenueBreakdown(orders));
        data.put("trends", buildTrendData(orders));

        return data;
    }

    private Map<String, Object> buildTrendData(List<Order> orders) {
        LocalDate now = LocalDate.now();
        LinkedHashMap<String, Integer> monthly = initMonthlyBuckets(now);
        LinkedHashMap<String, Integer> weekly = initWeeklyBuckets(now);
        LinkedHashMap<String, Integer> daily = initDailyBuckets(now);

        if (orders != null) {
            WeekFields weekFields = WeekFields.of(Locale.getDefault());
            LocalDate currentWeekStart = now.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));

            for (Order order : orders) {
                if (order == null || order.getOrderDate() == null) {
                    continue;
                }

                LocalDate orderDate = order.getOrderDate().toLocalDate();
                accumulateMonthly(orderDate, now, monthly);
                accumulateWeekly(orderDate, currentWeekStart, weekFields, weekly);
                accumulateDaily(orderDate, now, daily);
            }
        }

        Map<String, Object> trends = new HashMap<>();
        trends.put("month", toSeries(monthly));
        trends.put("week", toSeries(weekly));
        trends.put("day", toSeries(daily));
        return trends;
    }

    private LinkedHashMap<String, Integer> initMonthlyBuckets(LocalDate now) {
        LinkedHashMap<String, Integer> buckets = new LinkedHashMap<>();
        for (int i = 3; i >= 0; i--) {
            LocalDate month = now.minusMonths(i);
            buckets.put(String.format("Th%d", month.getMonthValue()), 0);
        }
        return buckets;
    }

    private LinkedHashMap<String, Integer> initWeeklyBuckets(LocalDate now) {
        LinkedHashMap<String, Integer> buckets = new LinkedHashMap<>();
        WeekFields weekFields = WeekFields.of(Locale.getDefault());
        for (int i = 7; i >= 0; i--) {
            LocalDate weekStart = now.minusWeeks(i).with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
            buckets.put(formatWeekLabel(weekStart, weekFields), 0);
        }
        return buckets;
    }

    private LinkedHashMap<String, Integer> initDailyBuckets(LocalDate now) {
        LinkedHashMap<String, Integer> buckets = new LinkedHashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM");
        for (int i = 6; i >= 0; i--) {
            LocalDate day = now.minusDays(i);
            buckets.put(day.format(formatter), 0);
        }
        return buckets;
    }

    private void accumulateMonthly(LocalDate orderDate, LocalDate now, LinkedHashMap<String, Integer> monthly) {
        long monthsDiff = ChronoUnit.MONTHS.between(orderDate.withDayOfMonth(1), now.withDayOfMonth(1));
        if (monthsDiff >= 0 && monthsDiff <= 3) {
            String key = String.format("Th%d", orderDate.getMonthValue());
            monthly.computeIfPresent(key, (k, v) -> v + 1);
        }
    }

    private void accumulateWeekly(LocalDate orderDate,
                                  LocalDate currentWeekStart,
                                  WeekFields weekFields,
                                  LinkedHashMap<String, Integer> weekly) {
        LocalDate orderWeekStart = orderDate.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        long weeksDiff = ChronoUnit.WEEKS.between(orderWeekStart, currentWeekStart);
        if (weeksDiff >= 0 && weeksDiff <= 7) {
            String key = formatWeekLabel(orderWeekStart, weekFields);
            weekly.computeIfPresent(key, (k, v) -> v + 1);
        }
    }

    private void accumulateDaily(LocalDate orderDate, LocalDate now, LinkedHashMap<String, Integer> daily) {
        long daysDiff = ChronoUnit.DAYS.between(orderDate, now);
        if (daysDiff >= 0 && daysDiff <= 6) {
            String key = orderDate.format(DateTimeFormatter.ofPattern("dd/MM"));
            daily.computeIfPresent(key, (k, v) -> v + 1);
        }
    }

    private String formatWeekLabel(LocalDate weekStart, WeekFields weekFields) {
        int weekNumber = weekStart.get(weekFields.weekOfWeekBasedYear());
        int year = weekStart.get(weekFields.weekBasedYear());
        return String.format("Tuần %02d/%d", weekNumber, year % 100);
    }

    private Map<String, Object> toSeries(LinkedHashMap<String, Integer> buckets) {
        Map<String, Object> series = new HashMap<>();
        series.put("labels", new ArrayList<>(buckets.keySet()));
        series.put("values", new ArrayList<>(buckets.values()));
        return series;
    }

    private List<Map<String, Object>> buildRevenueBreakdown(List<Order> orders) {
        Map<Long, ProductRevenueSummary> revenueByProduct = new HashMap<>();

        if (orders != null) {
            for (Order order : orders) {
                if (order == null || order.getOrderDetails() == null) {
                    continue;
                }

                for (OrderDetail detail : order.getOrderDetails()) {
                    if (detail == null || detail.getProduct() == null) {
                        continue;
                    }

                    Product product = detail.getProduct();
                    Long productId = product.getId();
                    ProductRevenueSummary summary = revenueByProduct.computeIfAbsent(
                            productId,
                            id -> new ProductRevenueSummary(product.getName() != null ? product.getName() : "Sản phẩm " + id)
                    );

                    double price = detail.getPrice() != null ? detail.getPrice() : 0.0;
                    int quantity = detail.getQuantity() != null ? detail.getQuantity() : 0;
                    summary.revenue += price * quantity;
                    summary.quantity += quantity;
                }
            }
        }

        List<Map<String, Object>> breakdown = new ArrayList<>();
        revenueByProduct.entrySet().stream()
                .sorted(Comparator.comparingDouble((Map.Entry<Long, ProductRevenueSummary> e) -> e.getValue().revenue).reversed())
                .limit(12)
                .forEach(entry -> {
                    ProductRevenueSummary summary = entry.getValue();
                    Map<String, Object> item = new HashMap<>();
                    item.put("productId", entry.getKey());
                    item.put("name", summary.name);
                    item.put("revenue", summary.revenue);
                    item.put("quantity", summary.quantity);
                    breakdown.add(item);
                });

        return breakdown;
    }

    private static class ProductRevenueSummary {
        final String name;
        double revenue = 0.0;
        int quantity = 0;

        ProductRevenueSummary(String name) {
            this.name = name;
        }
    }

    // ==================== PRODUCT MANAGEMENT ====================
    @GetMapping("/products")
    public String products(HttpSession session, Model model) {
        String redirect = checkAdminAndRedirect(session);
        if (redirect != null) return redirect;

        Account account = (Account) session.getAttribute("account");
        model.addAttribute("isLoggedIn", true);
        model.addAttribute("userDisplayName", account.getFullName());
        model.addAttribute("isAdmin", true);

        List<Product> products = productService.findAllProducts();
        model.addAttribute("products", products);

        return "admin/products";
    }

    @GetMapping("/products/new")
    public String productForm(HttpSession session, Model model) {
        String redirect = checkAdminAndRedirect(session);
        if (redirect != null) return redirect;

        Account account = (Account) session.getAttribute("account");
        model.addAttribute("isLoggedIn", true);
        model.addAttribute("userDisplayName", account.getFullName());
        model.addAttribute("isAdmin", true);
        model.addAttribute("product", new Product());

        return "admin/product-form";
    }

    @GetMapping("/products/edit/{id}")
    public String productEditForm(@PathVariable Long id, HttpSession session, Model model) {
        String redirect = checkAdminAndRedirect(session);
        if (redirect != null) return redirect;

        Account account = (Account) session.getAttribute("account");
        Product product = productService.findProductById(id);
        
        if (product == null) {
            return "redirect:/admin/products";
        }

        model.addAttribute("isLoggedIn", true);
        model.addAttribute("userDisplayName", account.getFullName());
        model.addAttribute("isAdmin", true);
        model.addAttribute("product", product);

        return "admin/product-form";
    }

    // API: Get All Products (for admin)
    @GetMapping("/api/products")
    @ResponseBody
    public ResponseEntity<List<Product>> getAllProducts(HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<Product> products = productService.findAllProducts();
        return ResponseEntity.ok(products);
    }

    // API: Get Product by ID (for admin)
    @GetMapping("/api/products/{id}")
    @ResponseBody
    public ResponseEntity<Product> getProductById(@PathVariable Long id, HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Product product = productService.findProductById(id);
        if (product != null) {
            return ResponseEntity.ok(product);
        }
        return ResponseEntity.notFound().build();
    }

    // API: Create Product
    @PostMapping("/api/products")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> createProduct(@RequestBody Product product, HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            Product created = productService.createProduct(product);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Tạo sản phẩm thành công");
            response.put("product", created);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // API: Update Product
    @PutMapping("/api/products/{id}")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> updateProduct(@PathVariable Long id, @RequestBody Product product, HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            Product updated = productService.updateProduct(id, product);
            if (updated != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Cập nhật sản phẩm thành công");
                response.put("product", updated);
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Không tìm thấy sản phẩm");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // API: Delete Product
    @DeleteMapping("/api/products/{id}")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> deleteProduct(@PathVariable Long id, HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
//            boolean deleted = productService.deleteProduct(id);
            Product deleted = productService.findProductById(id);
            Map<String, Object> response = new HashMap<>();
            if (deleted != null) {
                deleted.setStockQuantity(0);
                productService.updateProduct(id, deleted);
                response.put("success", true);
                response.put("message", "Xóa sản phẩm thành công");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Không tìm thấy sản phẩm");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // ==================== ORDER MANAGEMENT ====================
    @GetMapping("/orders")
    public String orders(HttpSession session, Model model) {
        String redirect = checkAdminAndRedirect(session);
        if (redirect != null) return redirect;

        Account account = (Account) session.getAttribute("account");
        model.addAttribute("isLoggedIn", true);
        model.addAttribute("userDisplayName", account.getFullName());
        model.addAttribute("isAdmin", true);

        List<Order> orders = orderService.getAllOrders();
        model.addAttribute("orders", orders);

        return "admin/orders";
    }
//    @GetMapping("/orders/{status}")
//    public String ordersByStatus(@PathVariable String status, HttpSession session, Model model) {
//        String redirect = checkAdminAndRedirect(session);
//        if (redirect != null) return redirect;
//        Account account = (Account) session.getAttribute("account");
//        model.addAttribute("isLoggedIn", true);
//        model.addAttribute("userDisplayName", account.getFullName());
//        model.addAttribute("isAdmin", true);
//        List<Order> orders = orderService.findByStatus(status);
//        model.addAttribute("orders", orders);
//        model.addAttribute("filterStatus", status);
//        return "admin/orders";
//    }

    @GetMapping("/orders/{id}")
    public String orderDetail(@PathVariable Long id, HttpSession session, Model model) {
        String redirect = checkAdminAndRedirect(session);
        if (redirect != null) return redirect;

        Account account = (Account) session.getAttribute("account");
        Order order = orderService.getOrderById(id);
//        if ((account == null || !Objects.equals(account.getId(), order.getAccount().getId())) || !"ADMIN".equals(account.getRole())) {
//            return "redirect:/login?error=Không có quyền truy cập";
//        }
        
        if (order == null) {
            return "redirect:/admin/orders";
        }

        model.addAttribute("isLoggedIn", true);
        model.addAttribute("userDisplayName", account.getFullName());
        model.addAttribute("isAdmin", true);
        model.addAttribute("order", order);

        return "admin/order-detail";
    }

    // API: Get All Orders (for admin)
    @GetMapping("/api/orders")
    @ResponseBody
    public ResponseEntity<List<Order>> getAllOrders(HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

//     API: Get Order by ID (for admin)
    @GetMapping("/api/orders/{id}")
    @ResponseBody
    public ResponseEntity<Order> getOrderById(@PathVariable Long id, HttpSession session) {
        Order order = orderService.getOrderById(id);
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        if (order != null) {
            return ResponseEntity.ok(order);
        }
        return ResponseEntity.notFound().build();
    }

    // API: Update Order Status
    @PutMapping("/api/orders/{id}/status")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> request, HttpSession session) {
//        if (!isAdmin(session)) {
//            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
//        }
        try {
            String status = request.get("status");
            Order order = orderService.getOrderById(id);
            if (order != null) {
                order.setStatus(status);
                Order updated = orderService.updateOrder(id, order);
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Cập nhật trạng thái đơn hàng thành công");
                response.put("order", updated);
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Không tìm thấy đơn hàng");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // API: Delete Order
    @DeleteMapping("/api/orders/{id}")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> deleteOrder(@PathVariable Long id, HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            boolean deleted = orderService.deleteOrder(id);
            Map<String, Object> response = new HashMap<>();
            if (deleted) {
                response.put("success", true);
                response.put("message", "Xóa đơn hàng thành công");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Không tìm thấy đơn hàng");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // ==================== ACCOUNT MANAGEMENT ====================
    @GetMapping("/accounts")
    public String accounts(HttpSession session, Model model) {
        String redirect = checkAdminAndRedirect(session);
        if (redirect != null) return redirect;

        Account account = (Account) session.getAttribute("account");
        model.addAttribute("isLoggedIn", true);
        model.addAttribute("userDisplayName", account.getFullName());
        model.addAttribute("isAdmin", true);
        model.addAttribute("currentAccountId", account.getId());

        List<Account> accounts = accountService.findAllAccounts();
        model.addAttribute("accounts", accounts);

        return "admin/accounts";
    }

    @GetMapping("/accounts/new")
    public String accountForm(HttpSession session, Model model) {
        String redirect = checkAdminAndRedirect(session);
        if (redirect != null) return redirect;

        Account account = (Account) session.getAttribute("account");
        model.addAttribute("isLoggedIn", true);
        model.addAttribute("userDisplayName", account.getFullName());
        model.addAttribute("isAdmin", true);
        model.addAttribute("account", new Account());

        return "admin/account-form";
    }

    @GetMapping("/accounts/edit/{id}")
    public String accountEditForm(@PathVariable Long id, HttpSession session, Model model) {
        String redirect = checkAdminAndRedirect(session);
        if (redirect != null) return redirect;

        Account account = (Account) session.getAttribute("account");
        Account accountToEdit = accountService.findById(id);
        
        if (accountToEdit == null) {
            return "redirect:/admin/accounts";
        }

        model.addAttribute("isLoggedIn", true);
        model.addAttribute("userDisplayName", account.getFullName());
        model.addAttribute("isAdmin", true);
        model.addAttribute("account", accountToEdit);

        return "admin/account-form";
    }

    // API: Get All Accounts (for admin)
    @GetMapping("/api/accounts")
    @ResponseBody
    public ResponseEntity<List<Account>> getAllAccounts(HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<Account> accounts = accountService.findAllAccounts();
        // Remove password from response for security
        accounts.forEach(account -> account.setPassword(null));
        return ResponseEntity.ok(accounts);
    }

    // API: Get Account by ID (for admin)
    @GetMapping("/api/accounts/{id}")
    @ResponseBody
    public ResponseEntity<Account> getAccountById(@PathVariable Long id, HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Account account = accountService.findById(id);
        if (account != null) {
            // Remove password from response for security
            account.setPassword(null);
            return ResponseEntity.ok(account);
        }
        return ResponseEntity.notFound().build();
    }

    // API: Create Account
    @PostMapping("/api/accounts")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> createAccount(@RequestBody Account account, HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            // Validate required fields
            if (account.getUsername() == null || account.getUsername().trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Username không được để trống");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            if (account.getEmail() == null || account.getEmail().trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Email không được để trống");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            // Check if username or email already exists
            if (accountService.existsByName(account.getUsername())) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Username đã tồn tại");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            if (accountService.existsByEmail(account.getEmail())) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Email đã tồn tại");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            // Set default role if not provided
            if (account.getRole() == null || account.getRole().trim().isEmpty()) {
                account.setRole("USER");
            }

            // Create new account
            Account newAccount = new Account();
            newAccount.setUsername(account.getUsername());
            newAccount.setEmail(account.getEmail());
            newAccount.setPassword(account.getPassword() != null && !account.getPassword().trim().isEmpty() 
                ? account.getPassword() : "123456"); // Default password
            newAccount.setFullName(account.getFullName());
            newAccount.setPhone(account.getPhone());
            newAccount.setAddress(account.getAddress());
            newAccount.setRole(account.getRole() != null && !account.getRole().trim().isEmpty() 
                ? account.getRole() : "USER");
            
            // Save account directly using repository (we'll need to inject it or add a save method)
            // For now, use register and then update
            accountService.register(
                account.getUsername(),
                account.getEmail(),
                account.getPhone() != null ? account.getPhone() : "",
                account.getPassword() != null && !account.getPassword().trim().isEmpty() 
                    ? account.getPassword() : "123456",
                account.getAddress() != null ? account.getAddress() : ""
            );

            // Update additional fields
            Account createdAccount = accountService.findByUsername(account.getUsername());
            if (createdAccount != null) {
                if (account.getFullName() != null) {
                    createdAccount.setFullName(account.getFullName());
                }
                if (account.getRole() != null && !account.getRole().trim().isEmpty()) {
                    createdAccount.setRole(account.getRole());
                }
                accountService.updateProfile(createdAccount);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Tạo tài khoản thành công");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // API: Update Account
    @PutMapping("/api/accounts/{id}")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> updateAccount(@PathVariable Long id, @RequestBody Account account, HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            Account currentAccount = (Account) session.getAttribute("account");
            if (currentAccount == null || !Objects.equals(currentAccount.getId(), id)) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Không có quyền chỉnh sửa tài khoản này");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }

            Account existingAccount = accountService.findById(id);
            if (existingAccount == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Không tìm thấy tài khoản");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            // Update fields
            if (account.getUsername() != null && !account.getUsername().trim().isEmpty()) {
                existingAccount.setUsername(account.getUsername());
            }
            if (account.getEmail() != null && !account.getEmail().trim().isEmpty()) {
                existingAccount.setEmail(account.getEmail());
            }
            if (account.getPassword() != null && !account.getPassword().trim().isEmpty()) {
                boolean isSelfUpdate = currentAccount != null && Objects.equals(currentAccount.getId(), existingAccount.getId());
                if (isSelfUpdate) {
                    existingAccount.setPassword(account.getPassword());
                }
            }
            // Password chỉ được cập nhật bởi chính chủ tài khoản
            if (account.getFullName() != null) {
                existingAccount.setFullName(account.getFullName());
            }
            if (account.getPhone() != null) {
                existingAccount.setPhone(account.getPhone());
            }
            if (account.getAddress() != null) {
                existingAccount.setAddress(account.getAddress());
            }
            if (account.getRole() != null && !account.getRole().trim().isEmpty()) {
                existingAccount.setRole(account.getRole());
            }

            boolean updated = accountService.updateProfile(existingAccount);
            Map<String, Object> response = new HashMap<>();
            if (updated) {
                response.put("success", true);
                response.put("message", "Cập nhật tài khoản thành công");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Không thể cập nhật tài khoản");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PutMapping("/api/account/status")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> updateAccountStatus(@RequestBody Map<String, Object> request, HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            Long id = Long.valueOf(String.valueOf(request.get("id")));
            String status = (String) request.get("status");

            Account existingAccount = accountService.findById(id);
            if (existingAccount == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Không tìm thấy tài khoản");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            existingAccount.setStatus(status);
            boolean updated = accountService.updateProfile(existingAccount);

            Map<String, Object> response = new HashMap<>();
            if (updated) {
                response.put("success", true);
                response.put("message", "Cập nhật trạng thái tài khoản thành công");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Không thể cập nhật trạng thái tài khoản");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    //API: Delete Account

    @GetMapping("/api/accounts/{id}/delete")
    public String deleteAccountGet(@PathVariable Long id, HttpSession session) {
        if (!isAdmin(session)) {
            return "redirect:/login?error=Không có quyền truy cập";
        }

        try {
            Account accountToDelete = accountService.findById(id);
            if (accountToDelete == null) {
                return "redirect:/admin/accounts?error=Không tìm thấy tài khoản";
            }

            // Prevent deleting the last admin account
            if ("ADMIN".equals(accountToDelete.getRole())) {
                List<Account> allAccounts = accountService.findAllAccounts();
                long adminCount = allAccounts.stream()
                    .filter(acc -> "ADMIN".equals(acc.getRole()))
                    .count();
                if (adminCount <= 1) {
                    return "redirect:/admin/accounts?error=Không thể xóa tài khoản admin cuối cùng";
                }
            }

            // Delete account using repository
            // Note: We need to add delete method or use repository directly
            accountService.deleteAccount(id);

            return "redirect:/admin/accounts?success=Xóa tài khoản thành công";
        } catch (Exception e) {
            return "redirect:/admin/accounts?error=Lỗi: " + e.getMessage();
        }
    }
    @PostMapping("/account/update-status")
    @ResponseBody
    public ResponseEntity<String> updateAccountStatus(@RequestParam("id") Long id,
                                       @RequestParam("status") String status, HttpSession session) {

        try {
            accountService.updateAccountStatus(id, status);
            return ResponseEntity.ok("Cập nhật trạng thái thành công");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi cập nhật trạng thái tài khoản");
        }

    }

    // API: Delete Account
//    @DeleteMapping("/api/accounts/{id}")
//    @ResponseBody
//    public ResponseEntity<Map<String, Object>> deleteAccount(@PathVariable Long id, HttpSession session) {
//        if (!isAdmin(session)) {
//            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
//        }
//
//        try {
//            Account accountToDelete = accountService.findById(id);
//            if (accountToDelete == null) {
//                Map<String, Object> response = new HashMap<>();
//                response.put("success", false);
//                response.put("message", "Không tìm thấy tài khoản");
//                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
//            }
//
//            // Prevent deleting the last admin account
//            if ("ADMIN".equals(accountToDelete.getRole())) {
//                List<Account> allAccounts = accountService.findAllAccounts();
//                long adminCount = allAccounts.stream()
//                    .filter(acc -> "ADMIN".equals(acc.getRole()))
//                    .count();
//                if (adminCount <= 1) {
//                    Map<String, Object> response = new HashMap<>();
//                    response.put("success", false);
//                    response.put("message", "Không thể xóa tài khoản admin cuối cùng");
//                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
//                }
//            }
//
//            // Delete account using repository
//            // Note: We need to add delete method or use repository directly
//            accountService.deleteAccount(id);
//
//            Map<String, Object> response = new HashMap<>();
//            response.put("success", true);
//            response.put("message", "Xóa tài khoản thành công");
//            return ResponseEntity.ok(response);
//        } catch (Exception e) {
//            Map<String, Object> response = new HashMap<>();
//            response.put("success", false);
//            response.put("message", "Lỗi: " + e.getMessage());
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
//        }
//    }
}


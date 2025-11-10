package org.example.website_sellflower.controller;

import jakarta.servlet.http.HttpSession;
import org.example.website_sellflower.entity.Account;
import org.example.website_sellflower.entity.Order;
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

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
        return account != null && "ADMIN".equals(account.getRole());
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

        // Thống kê (sẽ được implement ở backend)
        model.addAttribute("totalProducts", productService.findAllProducts().size());
        model.addAttribute("totalOrders", orderService.getAllOrders().size());
        // model.addAttribute("totalAccounts", accountService.findAll().size());
        // model.addAttribute("totalRevenue", orderService.getTotalRevenue());

        return "admin/dashboard";
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
            boolean deleted = productService.deleteProduct(id);
            Map<String, Object> response = new HashMap<>();
            if (deleted) {
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

    @GetMapping("/orders/{id}")
    public String orderDetail(@PathVariable Long id, HttpSession session, Model model) {
        String redirect = checkAdminAndRedirect(session);
        if (redirect != null) return redirect;

        Account account = (Account) session.getAttribute("account");
        Order order = orderService.getOrderById(id);
        
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

    // API: Get Order by ID (for admin)
    @GetMapping("/api/orders/{id}")
    @ResponseBody
    public ResponseEntity<Order> getOrderById(@PathVariable Long id, HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Order order = orderService.getOrderById(id);
        if (order != null) {
            return ResponseEntity.ok(order);
        }
        return ResponseEntity.notFound().build();
    }

    // API: Update Order Status
    @PutMapping("/api/orders/{id}/status")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> request, HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

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

    // ==================== ACCOUNT MANAGEMENT ====================
    @GetMapping("/accounts")
    public String accounts(HttpSession session, Model model) {
        String redirect = checkAdminAndRedirect(session);
        if (redirect != null) return redirect;

        Account account = (Account) session.getAttribute("account");
        model.addAttribute("isLoggedIn", true);
        model.addAttribute("userDisplayName", account.getFullName());
        model.addAttribute("isAdmin", true);

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
                existingAccount.setPassword(account.getPassword());
            }
            // Only update password if provided
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


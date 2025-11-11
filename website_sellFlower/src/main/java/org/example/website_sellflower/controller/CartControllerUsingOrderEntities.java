package org.example.website_sellflower.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.example.website_sellflower.entity.Account;
import org.example.website_sellflower.entity.Order;
import org.example.website_sellflower.entity.OrderDetail;
import org.example.website_sellflower.entity.Product;
import org.example.website_sellflower.service.AccountService;
import org.example.website_sellflower.service.OrderService;
import org.example.website_sellflower.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.LocalDateTime;
import java.util.*;

/**
 * Cart controller that re-uses OrderDetail as session item (detached).
 * Provides:
 *  - GET  /cart        -> return "cart" view (templates/cart.html)
 *  - GET  /cart/add    -> redirect to /cart to avoid static resource lookup
 *  - POST /cart/add    -> support form-based add-to-cart (redirect back to referer)
 *  - APIs under /cart/api...
 */
@Controller
@RequestMapping("/cart")
public class CartControllerUsingOrderEntities {

    private static final String SESSION_CART = "cart";

    @Autowired
    private ProductService productService;

    @Autowired
    private AccountService accountService;

    @Autowired
    private OrderService orderService;

    @SuppressWarnings("unchecked")
    private List<OrderDetail> getCart(HttpSession session) {
        Object raw = session.getAttribute(SESSION_CART);
        if (raw instanceof List) {
            return (List<OrderDetail>) raw;
        }
        List<OrderDetail> empty = new ArrayList<>();
        session.setAttribute(SESSION_CART, empty);
        return empty;
    }

    // Return cart page (Thymeleaf template name "cart")
    @GetMapping({"", "/"})
    public String viewCartPage(Model model, HttpSession session) {
        if (session.getAttribute("account") != null) {
            Account account = (Account) session.getAttribute("account");
            model.addAttribute("isLoggedIn", true);
            model.addAttribute("userDisplayName",account.getFullName());
            model.addAttribute("isAdmin", "ADMIN".equals(account.getRole()));
            List<OrderDetail> cart = (List<OrderDetail>) session.getAttribute("cart");
            if (cart != null) {
                model.addAttribute("cartItemCount", cart.size());
            }

        } else {
            model.addAttribute("isLoggedIn", false);
            return "redirect:/login";
        }
        return "cart";
    }

    // Redirect /cart/add (GET) -> /cart to prevent static resource 404
    @GetMapping("/add")
    public String redirectAddToCart() {
        return "redirect:/cart";
    }

    /**
     * New: Support form-based add-to-cart.
     * Accepts form submissions (application/x-www-form-urlencoded) from product pages that post to /cart/add.
     * After adding the item, redirects back to the Referer (product page) if available, otherwise to /cart.
     *
     * Expected form parameters (common names):
     * - productId (required)
     * - quantity (optional, default 1)
     * - productName, price, imageUrl, stock  (optional — we ignore most, use DB snapshot)
     */
//    @PostMapping("/add")
//    public String handleFormAddToCart(@RequestParam("productId") Long productId,
//                                      @RequestParam(value = "quantity", required = false, defaultValue = "1") Integer quantity,
//                                      HttpSession session,
//                                      HttpServletRequest request,
//                                      RedirectAttributes redirectAttributes) {
//        if (productId == null || quantity == null || quantity <= 0) {
//            redirectAttributes.addFlashAttribute("cartMessage", "Tham số sản phẩm không hợp lệ");
//            return "redirect:" + safeReferer(request);
//        }
//
//        Product prod = productService.findProductById(productId);
//        if (prod == null) {
//            redirectAttributes.addFlashAttribute("cartMessage", "Sản phẩm không tồn tại");
//            return "redirect:" + safeReferer(request);
//        }
//
//        List<OrderDetail> cart = getCart(session);
//
//        Optional<OrderDetail> exist = cart.stream()
//                .filter(od -> od.getProduct() != null && Objects.equals(od.getProduct().getId(), productId))
//                .findFirst();
//
//        if (exist.isPresent()) {
//            OrderDetail ex = exist.get();
//            int newQty = ex.getQuantity() + quantity;
//            Integer stock = prod.getStockQuantity();
//            if (stock != null && newQty > stock) {
//                ex.setQuantity(stock);
//            } else {
//                ex.setQuantity(newQty);
//            }
//        } else {
//            OrderDetail item = new OrderDetail();
//            Product pDetached = new Product();
//            pDetached.setId(prod.getId());
//            item.setProduct(pDetached);
//            item.setQuantity(quantity);
//            item.setPrice(prod.getPrice());
//            cart.add(item);
//        }
//
//        session.setAttribute(SESSION_CART, cart);
//        int count = cart.stream().mapToInt(od -> od.getQuantity() == null ? 0 : od.getQuantity()).sum();
//
//        redirectAttributes.addFlashAttribute("cartMessage", "Đã thêm vào giỏ hàng");
//        redirectAttributes.addFlashAttribute("cartCount", count);
//
//        return "redirect:" + safeReferer(request);
//    }
    @PostMapping("/add")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> handleFormAddToCart(@RequestParam("productId") Long productId,
                                      @RequestParam(value = "quantity", required = false, defaultValue = "1") Integer quantity,
                                      HttpSession session,
                                      HttpServletRequest request,
                                      RedirectAttributes redirectAttributes) {
        Map<String, Object> resp = new HashMap<>();
        if (productId == null || quantity == null || quantity <= 0) {
            resp.put("success", false);
            resp.put("message", "Tham số sản phẩm không hợp lệ");
            return ResponseEntity.badRequest().body(resp);
        }

        Product prod = productService.findProductById(productId);
        if (prod == null) {
            resp.put("success", false);
            resp.put("message", "Sản phẩm không tồn tại");
            return ResponseEntity.badRequest().body(resp);
        }

        if (prod.getStockQuantity() != null && quantity > prod.getStockQuantity()) {
            resp.put("success", false);
            resp.put("message", "Số lượng vượt quá tồn kho");
            return ResponseEntity.badRequest().body(resp);
        }

        List<OrderDetail> cart = getCart(session);

        Optional<OrderDetail> exist = cart.stream()
                .filter(od -> od.getProduct() != null && Objects.equals(od.getProduct().getId(), productId))
                .findFirst();

        if (exist.isPresent()) {
            OrderDetail ex = exist.get();
            int newQty = ex.getQuantity() + quantity;
            Integer stock = prod.getStockQuantity();
            if (stock != null && newQty > stock) {
                ex.setQuantity(stock);
            } else {
                ex.setQuantity(newQty);
            }
        } else {
            OrderDetail item = new OrderDetail();
            Product pDetached = new Product();
            pDetached.setId(prod.getId());
            item.setProduct(pDetached);
            item.setQuantity(quantity);
            item.setPrice(prod.getPrice());
            cart.add(item);
        }

        session.setAttribute(SESSION_CART, cart);
        int count = cart.stream().mapToInt(od -> od.getQuantity() == null ? 0 : od.getQuantity()).sum();
        resp.put("success", true);
        resp.put("message", "Đã thêm vào giỏ hàng");
        resp.put("cartCount", count);
        return ResponseEntity.ok(resp);
    }

    // Helper to get referer or fallback to /cart
    private String safeReferer(HttpServletRequest request) {
        String referer = request.getHeader("Referer");
        if (referer == null || referer.isBlank()) {
            return "/cart";
        }
        // Prevent open redirect: only use path portion if referer is same host or convert to path
        try {
            java.net.URI uri = new java.net.URI(referer);
            String path = uri.getPath();
            String query = uri.getQuery();
            return (query != null && !query.isEmpty()) ? path + "?" + query : path;
        } catch (Exception e) {
            return "/cart";
        }
    }

    // Return cart for frontend in expected shape
    @GetMapping("/api")
    @ResponseBody
    public ResponseEntity<List<Map<String, Object>>> apiGetCart(HttpSession session) {
        List<OrderDetail> cart = getCart(session);
        List<Map<String, Object>> result = new ArrayList<>();

        for (OrderDetail det : cart) {
            Long pid = det.getProduct() != null ? det.getProduct().getId() : null;
            Integer qty = det.getQuantity() != null ? det.getQuantity() : 0;
            Double priceSnapshot = det.getPrice() != null ? det.getPrice() : 0.0;

            String name = null;
            String imageUrl = null;
            Integer stock = null;

            if (pid != null) {
                Product p = productService.findProductById(pid);
                if (p != null) {
                    try { name = p.getName(); } catch (Exception ignored) {}
                    try { imageUrl = p.getImageUrl(); } catch (Exception ignored) {}
                    try { stock = p.getStockQuantity(); } catch (Exception ignored) {}
                }
            }

            Map<String, Object> item = new HashMap<>();
            item.put("productId", pid);
            item.put("productName", name);
            item.put("price", priceSnapshot);
            item.put("quantity", qty);
            item.put("imageUrl", imageUrl);
            item.put("stock", stock);

            result.add(item);
        }

        return ResponseEntity.ok(result);
    }

    // API: Add to cart: create detached OrderDetail carrying product.id, quantity and snapshot price
//    @PostMapping("/api/add")
//    @ResponseBody
//    public ResponseEntity<Map<String, Object>> apiAddToCart(@RequestParam("productId") Long productId,
//                                                            @RequestParam(value = "quantity", required = false, defaultValue = "1") Integer quantity,
//                                                            HttpSession session) {
//        Map<String, Object> resp = new HashMap<>();
//        if (productId == null || quantity == null || quantity <= 0) {
//            resp.put("success", false);
//            resp.put("message", "productId và quantity không hợp lệ");
//            return ResponseEntity.badRequest().body(resp);
//        }
//
//        Product prod = productService.findProductById(productId);
//        if (prod == null) {
//            resp.put("success", false);
//            resp.put("message", "Sản phẩm không tồn tại");
//            return ResponseEntity.badRequest().body(resp);
//        }
//
//        List<OrderDetail> cart = getCart(session);
//
//        // Try merge existing
//        Optional<OrderDetail> exist = cart.stream()
//                .filter(od -> od.getProduct() != null && Objects.equals(od.getProduct().getId(), productId))
//                .findFirst();
//
//        if (exist.isPresent()) {
//            OrderDetail ex = exist.get();
//            int newQty = ex.getQuantity() + quantity;
//            Integer stock = prod.getStockQuantity();
//            if (stock != null && newQty > stock) {
//                ex.setQuantity(stock);
//            } else {
//                ex.setQuantity(newQty);
//            }
//        } else {
//            OrderDetail item = new OrderDetail();
//            Product pDetached = new Product();
//            pDetached.setId(prod.getId());
//            item.setProduct(pDetached);
//            item.setQuantity(quantity);
//            item.setPrice(prod.getPrice());
//            cart.add(item);
//        }
//
//        session.setAttribute(SESSION_CART, cart);
//        int count = cart.stream().mapToInt(od -> od.getQuantity() == null ? 0 : od.getQuantity()).sum();
//
//        resp.put("success", true);
//        resp.put("message", "Đã thêm vào giỏ hàng");
//        resp.put("cartCount", count);
//        return ResponseEntity.ok(resp);
//    }

    // Update quantity
    @PutMapping("/api/update")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> apiUpdateCart(@RequestParam("productId") Long productId,
                                                             @RequestParam("quantity") Integer quantity,
                                                             HttpSession session) {
        Map<String, Object> resp = new HashMap<>();
        if (productId == null || quantity == null) {
            resp.put("success", false);
            resp.put("message", "Thiếu tham số");
            return ResponseEntity.badRequest().body(resp);
        }

        List<OrderDetail> cart = getCart(session);
        for (Iterator<OrderDetail> it = cart.iterator(); it.hasNext(); ) {
            OrderDetail od = it.next();
            if (od.getProduct() != null && Objects.equals(od.getProduct().getId(), productId)) {
                if (quantity <= 0) {
                    it.remove();
                } else {
                    Product prod = productService.findProductById(productId);
                    Integer stock = prod != null ? prod.getStockQuantity() : null;
                    if (stock != null && quantity > stock) {
                        od.setQuantity(stock);
                    } else {
                        od.setQuantity(quantity);
                    }
                }
                session.setAttribute(SESSION_CART, cart);
                int count = cart.stream().mapToInt(d -> d.getQuantity() == null ? 0 : d.getQuantity()).sum();
                resp.put("success", true);
                resp.put("message", "Cập nhật giỏ hàng thành công");
                resp.put("cartCount", count);
                return ResponseEntity.ok(resp);
            }
        }

        resp.put("success", false);
        resp.put("message", "Sản phẩm không tồn tại trong giỏ hàng");
        resp.put("cartCount", getCart(session).stream().mapToInt(d -> d.getQuantity() == null ? 0 : d.getQuantity()).sum());
        return ResponseEntity.ok(resp);
    }

    // Remove item
    @DeleteMapping("/api/remove/{productId}")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> apiRemoveCart(@PathVariable Long productId, HttpSession session) {
        List<OrderDetail> cart = getCart(session);
        boolean removed = cart.removeIf(od -> od.getProduct() != null && Objects.equals(od.getProduct().getId(), productId));
        session.setAttribute(SESSION_CART, cart);
        Map<String, Object> resp = new HashMap<>();
        resp.put("success", removed);
        resp.put("message", removed ? "Đã xóa sản phẩm khỏi giỏ hàng" : "Không tìm thấy sản phẩm");
        resp.put("cartCount", cart.stream().mapToInt(d -> d.getQuantity() == null ? 0 : d.getQuantity()).sum());
        return ResponseEntity.ok(resp);
    }

    // Checkout: create Order in DB from cart
    @PostMapping("/api/checkout")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> apiCheckout(HttpSession session) {
        Account sessAcc = (Account) session.getAttribute("account");
        Map<String, Object> resp = new HashMap<>();
        if (sessAcc == null) {
            resp.put("success", false);
            resp.put("message", "Vui lòng đăng nhập để đặt hàng");
            return ResponseEntity.status(401).body(resp);
        }

        List<OrderDetail> cart = getCart(session);
        if (cart == null || cart.isEmpty()) {
            resp.put("success", false);
            resp.put("message", "Giỏ hàng trống");
            return ResponseEntity.badRequest().body(resp);
        }

        try {
            Order order = new Order();
            Account fullAcc = accountService.findById(sessAcc.getId());
            order.setAccount(fullAcc);
            order.setOrderDate(LocalDateTime.now());
            order.setStatus("processing");
            order.setPhone(fullAcc != null ? fullAcc.getPhone() : null);
            order.setShippingAddress(fullAcc != null ? fullAcc.getAddress() : null);

            List<OrderDetail> detailsToSave = new ArrayList<>();
            for (OrderDetail detached : cart) {
                Long pid = detached.getProduct() != null ? detached.getProduct().getId() : null;
                if (pid == null) {
                    resp.put("success", false);
                    resp.put("message", "Sản phẩm trong giỏ không hợp lệ");
                    return ResponseEntity.badRequest().body(resp);
                }

                Product prod = productService.findProductById(pid);
                if (prod == null) {
                    resp.put("success", false);
                    resp.put("message", "Sản phẩm không tồn tại: id=" + pid);
                    return ResponseEntity.badRequest().body(resp);
                }

                int qty = detached.getQuantity() == null ? 0 : detached.getQuantity();
                if (qty <= 0) {
                    resp.put("success", false);
                    resp.put("message", "Số lượng không hợp lệ cho sản phẩm: " + prod.getName());
                    return ResponseEntity.badRequest().body(resp);
                }

                Integer stock = prod.getStockQuantity();
                if (stock != null && qty > stock) {
                    resp.put("success", false);
                    resp.put("message", "Không đủ hàng cho sản phẩm: " + prod.getName());
                    return ResponseEntity.badRequest().body(resp);
                }

                OrderDetail od = new OrderDetail();
                od.setOrder(order);
                od.setProduct(prod);
                od.setQuantity(qty);
                od.setPrice(prod.getPrice());
                detailsToSave.add(od);
            }

            order.setOrderDetails(detailsToSave);
            double total = detailsToSave.stream().mapToDouble(d -> (d.getPrice() != null ? d.getPrice() : 0.0) * d.getQuantity()).sum();
            order.setTotalAmount(total);

            Order created = orderService.createOrder(order);

            session.removeAttribute(SESSION_CART);

            resp.put("success", true);
            resp.put("orderId", created != null ? created.getId() : null);
            resp.put("message", "Đơn hoa đang được chuẩn bị và giao đến bạn");
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            resp.put("success", false);
            resp.put("message", "Lỗi khi tạo đơn hàng: " + e.getMessage());
            return ResponseEntity.status(500).body(resp);
        }
    }
}
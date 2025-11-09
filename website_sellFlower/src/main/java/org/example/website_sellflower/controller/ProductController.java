package org.example.website_sellflower.controller;

import jakarta.servlet.http.HttpSession;
import org.example.website_sellflower.entity.Account;
import org.example.website_sellflower.entity.Product;
import org.example.website_sellflower.entity.Review;
import org.example.website_sellflower.service.ProductService;
import org.example.website_sellflower.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/product")
    public String showProductList(Model model, HttpSession session) {
        Account account = (Account) session.getAttribute("account");
        if (account == null) {
            return "redirect:/login";
        }
        
        model.addAttribute("isLoggedIn", true);
        model.addAttribute("userDisplayName", account.getFullName());
        model.addAttribute("isAdmin", "ADMIN".equals(account.getRole()));
        List<Product> products = productService.findAllProducts();
        model.addAttribute("products", products);
        return "product";
    }

    @GetMapping("/product/detail/{id}")
    public String showProductDetail(@PathVariable Long id, Model model, HttpSession session) {
        Account account = (Account) session.getAttribute("account");
        if (account == null) {
            return "redirect:/login";
        }
        
        Product product = productService.findProductById(id);
        if (product == null) {
            return "redirect:/product";
        }
        
        List<Review> reviews = reviewService.findByProductId(id);
        
        model.addAttribute("isLoggedIn", true);
        model.addAttribute("userDisplayName", account.getFullName());
        model.addAttribute("isAdmin", "ADMIN".equals(account.getRole()));
        model.addAttribute("product", product);
        model.addAttribute("reviews", reviews);
        
        return "detail";
    }

    // API: Lấy tất cả sản phẩm (dùng cho trang product)
    @GetMapping("/api/products")
    @ResponseBody
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.findAllProducts();
        return ResponseEntity.ok(products);
    }

    // API: Lấy chi tiết 1 sản phẩm theo ID (dùng cho trang detail)
    @GetMapping("/api/products/{id}")
    @ResponseBody
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Product product = productService.findProductById(id);
        if (product != null) {
            return ResponseEntity.ok(product);
        }
        return ResponseEntity.notFound().build();
    }

    // API: Lấy reviews của 1 sản phẩm
    @GetMapping("/api/products/{id}/reviews")
    @ResponseBody
    public ResponseEntity<List<Review>> getProductReviews(@PathVariable Long id) {
        List<Review> reviews = reviewService.findByProductId(id);
        return ResponseEntity.ok(reviews);
    }
}
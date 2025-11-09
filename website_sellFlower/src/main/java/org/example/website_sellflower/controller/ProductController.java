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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.LocalDateTime;
import java.util.Collections;
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
        List<Product> products = productService.findAllProducts();
        model.addAttribute("products", products);
        return "product";
    }

    @GetMapping("/product/detail/{id}")
    public String showProductDetail(@PathVariable Long id, Model model, HttpSession session) {
        try {
            Account account = (Account) session.getAttribute("account");

            Product product = productService.findProductById(id);
            if (product == null) {
                return "redirect:/product";
            }

            // Load reviews separately to ensure account is loaded
            List<Review> reviews = reviewService.findByProductId(id);
            if (reviews == null) {
                reviews = Collections.emptyList();
            }

            // Ensure product has reviews loaded for getAverageRating() to work
            product.setReviews(reviews);

            if (account != null) {
                model.addAttribute("isLoggedIn", true);
                model.addAttribute("userDisplayName", account.getFullName() != null ? account.getFullName() : account.getUsername());
                model.addAttribute("currentAccount", account); // Add current account for ownership check
            } else {
                model.addAttribute("isLoggedIn", false);
            }
            model.addAttribute("product", product);
            model.addAttribute("reviews", reviews);

            return "detail";
        } catch (Exception e) {
            e.printStackTrace();
            return "redirect:/product";
        }
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

    // Submit review
    @PostMapping("/product/detail/{id}/review")
    public String submitReview(@PathVariable Long id,
                               @RequestParam Integer rating,
                               @RequestParam String comment,
                               HttpSession session,
                               RedirectAttributes redirectAttributes) {
        try {
            Account account = (Account) session.getAttribute("account");
            if (account == null) {
                return "redirect:/login";
            }

            Product product = productService.findProductById(id);
            if (product == null) {
                redirectAttributes.addFlashAttribute("error", "Sản phẩm không tồn tại");
                return "redirect:/product";
            }

            Review review = new Review();
            review.setProduct(product);
            review.setAccount(account);
            review.setRating(rating);
            review.setComment(comment);
            review.setReviewDate(LocalDateTime.now());

            reviewService.createReview(review);
            redirectAttributes.addFlashAttribute("success", "Đánh giá của bạn đã được gửi thành công!");

            return "redirect:/product/detail/" + id + "#reviews";
        } catch (Exception e) {
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("error", "Có lỗi xảy ra khi gửi đánh giá");
            return "redirect:/product/detail/" + id + "#reviews";
        }
    }

    // Update review - API endpoint for AJAX
    @PostMapping("/api/product/detail/{productId}/review/{reviewId}/update")
    @ResponseBody
    public ResponseEntity<?> updateReviewApi(@PathVariable Long productId,
                                             @PathVariable Long reviewId,
                                             @RequestParam Integer rating,
                                             @RequestParam String comment,
                                             HttpSession session) {
        try {
            Account account = (Account) session.getAttribute("account");
            if (account == null) {
                return ResponseEntity.status(401).body("{\"success\": false, \"message\": \"Vui lòng đăng nhập\"}");
            }

            Review review = reviewService.findReviewById(reviewId);
            if (review == null) {
                return ResponseEntity.status(404).body("{\"success\": false, \"message\": \"Đánh giá không tồn tại\"}");
            }

            // Check ownership
            if (review.getAccount() == null || !review.getAccount().getId().equals(account.getId())) {
                return ResponseEntity.status(403).body("{\"success\": false, \"message\": \"Bạn không có quyền chỉnh sửa đánh giá này\"}");
            }

            // Create updated review (only update rating, comment, and date)
            Review updatedReview = new Review();
            updatedReview.setRating(rating);
            updatedReview.setComment(comment);
            updatedReview.setReviewDate(LocalDateTime.now());
            // Keep existing account and product
            updatedReview.setAccount(review.getAccount());
            updatedReview.setProduct(review.getProduct());

            Review savedReview = reviewService.updateReview(reviewId, updatedReview);
            if (savedReview != null) {
                // Return success response (client will update DOM with form data)
                return ResponseEntity.ok("{\"success\": true, \"message\": \"Đánh giá đã được cập nhật thành công!\"}");
            } else {
                return ResponseEntity.status(500).body("{\"success\": false, \"message\": \"Có lỗi xảy ra khi cập nhật đánh giá\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"success\": false, \"message\": \"Có lỗi xảy ra khi cập nhật đánh giá\"}");
        }
    }

    // Update review - Keep for form submission (redirect)
    @PostMapping("/product/detail/{productId}/review/{reviewId}/update")
    public String updateReview(@PathVariable Long productId,
                               @PathVariable Long reviewId,
                               @RequestParam Integer rating,
                               @RequestParam String comment,
                               HttpSession session,
                               RedirectAttributes redirectAttributes) {
        try {
            Account account = (Account) session.getAttribute("account");
            if (account == null) {
                return "redirect:/login";
            }

            Review review = reviewService.findReviewById(reviewId);
            if (review == null) {
                redirectAttributes.addFlashAttribute("error", "Đánh giá không tồn tại");
                return "redirect:/product/detail/" + productId + "#reviews";
            }

            // Check ownership
            if (review.getAccount() == null || !review.getAccount().getId().equals(account.getId())) {
                redirectAttributes.addFlashAttribute("error", "Bạn không có quyền chỉnh sửa đánh giá này");
                return "redirect:/product/detail/" + productId + "#reviews";
            }

            // Create updated review (only update rating, comment, and date)
            Review updatedReview = new Review();
            updatedReview.setRating(rating);
            updatedReview.setComment(comment);
            updatedReview.setReviewDate(LocalDateTime.now());
            // Keep existing account and product
            updatedReview.setAccount(review.getAccount());
            updatedReview.setProduct(review.getProduct());

            reviewService.updateReview(reviewId, updatedReview);
            redirectAttributes.addFlashAttribute("success", "Đánh giá đã được cập nhật thành công!");

            return "redirect:/product/detail/" + productId + "#reviews";
        } catch (Exception e) {
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("error", "Có lỗi xảy ra khi cập nhật đánh giá");
            return "redirect:/product/detail/" + productId + "#reviews";
        }
    }

    // Delete review - API endpoint for AJAX
    @PostMapping("/api/product/detail/{productId}/review/{reviewId}/delete")
    @ResponseBody
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<?> deleteReviewApi(@PathVariable Long productId,
                                             @PathVariable Long reviewId,
                                             HttpSession session) {
        try {
            Account account = (Account) session.getAttribute("account");
            if (account == null) {
                return ResponseEntity.status(401).body("{\"success\": false, \"message\": \"Vui lòng đăng nhập\"}");
            }

            Review review = reviewService.findReviewById(reviewId);
            if (review == null) {
                return ResponseEntity.status(404).body("{\"success\": false, \"message\": \"Đánh giá không tồn tại\"}");
            }

            // Check ownership
            if (review.getAccount() == null || !review.getAccount().getId().equals(account.getId())) {
                return ResponseEntity.status(403).body("{\"success\": false, \"message\": \"Bạn không có quyền xóa đánh giá này\"}");
            }

            // Delete the review
            boolean deleted = reviewService.deleteReview(reviewId);

            if (deleted) {
                return ResponseEntity.ok("{\"success\": true, \"message\": \"Đánh giá đã được xóa thành công!\"}");
            } else {
                return ResponseEntity.status(500).body("{\"success\": false, \"message\": \"Không thể xóa đánh giá\"}");
            }
        } catch (Exception e) {
            String errorMessage = e.getMessage() != null ? e.getMessage() : "Unknown error";
            errorMessage = errorMessage.replace("\"", "\\\"").replace("\n", " ");
            return ResponseEntity.status(500).body("{\"success\": false, \"message\": \"Có lỗi xảy ra khi xóa đánh giá: " + errorMessage + "\"}");
        }
    }

    // Delete review - Keep for form submission (redirect)
    @PostMapping("/product/detail/{productId}/review/{reviewId}/delete")
    public String deleteReview(@PathVariable Long productId,
                               @PathVariable Long reviewId,
                               HttpSession session,
                               RedirectAttributes redirectAttributes) {
        try {
            Account account = (Account) session.getAttribute("account");
            if (account == null) {
                redirectAttributes.addFlashAttribute("error", "Vui lòng đăng nhập");
                return "redirect:/product/detail/" + productId + "#reviews";
            }

            Review review = reviewService.findReviewById(reviewId);
            if (review == null) {
                redirectAttributes.addFlashAttribute("error", "Đánh giá không tồn tại");
                return "redirect:/product/detail/" + productId + "#reviews";
            }

            // Check ownership
            if (review.getAccount() == null || !review.getAccount().getId().equals(account.getId())) {
                redirectAttributes.addFlashAttribute("error", "Bạn không có quyền xóa đánh giá này");
                return "redirect:/product/detail/" + productId + "#reviews";
            }

            reviewService.deleteReview(reviewId);
            redirectAttributes.addFlashAttribute("success", "Đánh giá đã được xóa thành công!");

            return "redirect:/product/detail/" + productId + "#reviews";
        } catch (Exception e) {
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("error", "Có lỗi xảy ra khi xóa đánh giá");
            return "redirect:/product/detail/" + productId + "#reviews";
        }
    }
}
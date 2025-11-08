package org.example.website_sellflower.service;

import org.example.website_sellflower.entity.Review;

import java.util.List;

public interface ReviewService {
    Review createReview(Review review);
    Review updateReview(Integer id,Review review);
    boolean deleteReview(Integer id);
    List<Review> findAllReviews();

    // ← THÊM MỚI
    List<Review> findByProductId(Long productId);
}
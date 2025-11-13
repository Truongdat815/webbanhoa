package org.example.website_sellflower.service.impl;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.example.website_sellflower.entity.Review;
import org.example.website_sellflower.repository.ReviewRepository;
import org.example.website_sellflower.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Review createReview(Review review) {
        return reviewRepository.save(review);
    }

    @Override
    public Review updateReview(Long id,Review updateReview) {
        Optional<Review> existingReview = reviewRepository.findById(id);
        if(existingReview.isPresent()){
            Review review = existingReview.get();
            review.setAccount(updateReview.getAccount());
            review.setProduct(updateReview.getProduct());
            review.setRating(updateReview.getRating());
            review.setComment(updateReview.getComment());
            review.setReviewDate(updateReview.getReviewDate());
            return reviewRepository.save(review);
        }
        return null;
    }

    @Override
    @Transactional
    public boolean deleteReview(Long id) {
        try {
            // First check if review exists
            if (!reviewRepository.existsById(id)) {
                return false;
            }

            // Try using native query first (most reliable for SQL Server)
            try {
                int deletedRows = reviewRepository.deleteReviewByIdNative(id);
                if (deletedRows > 0) {
                    entityManager.flush();
                    entityManager.clear();
                    return true;
                }
            } catch (Exception e) {
                // Fall back to standard deletion
            }

            // Fall back to EntityManager deletion
            try {
                Review review = reviewRepository.findById(id).orElse(null);
                if (review != null) {
                    review = entityManager.merge(review);
                    entityManager.remove(review);
                    entityManager.flush();
                    entityManager.clear();
                    return true;
                }
            } catch (Exception e) {
                // Fall back to repository deleteById
            }

            // Final fallback: repository deleteById
            try {
                reviewRepository.deleteById(id);
                entityManager.flush();
                entityManager.clear();
                return !reviewRepository.existsById(id);
            } catch (Exception e) {
                return false;
            }

        } catch (Exception e) {
            throw e;
        }
    }

    @Override
    public List<Review> findAllReviews() {
        return reviewRepository.findAll();
    }

    // ← THÊM MỚI
    @Override
    public List<Review> findByProductId(Long productId) {
        return reviewRepository.findByProductIdOrderByReviewDateDesc(productId);
    }

    @Override
    public Review findReviewById(Long id) {
        return reviewRepository.findById(id).orElse(null);
    }

    // Thêm methods cho admin quản lý review
    @Override
    public List<Review> findByStatus(String status) {
        return reviewRepository.findByStatus(status);
    }

    @Override
    public Review updateReviewStatus(Long id, String status) {
        Optional<Review> existingReview = reviewRepository.findById(id);
        if(existingReview.isPresent()){
            Review review = existingReview.get();
            review.setStatus(status);
            return reviewRepository.save(review);
        }
        return null;
    }

    @Override
    public List<Review> findPendingReviews() {
        return reviewRepository.findByStatus("PENDING");
    }
}
package org.example.website_sellflower.service.impl;

import org.example.website_sellflower.entity.Review;
import org.example.website_sellflower.repository.ReviewRepository;
import org.example.website_sellflower.service.ReviewService;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;

import java.util.List;

// @Service  // TẠM THỜI COMMENT - Sẽ uncomment khi có database
public class ReviewServiceImpl implements ReviewService {

    // @Autowired  // TẠM THỜI COMMENT
    private ReviewRepository reviewRepository;

    @Override
    public Review createReview(Review review) {
        // Tạm thời return null - sẽ implement sau khi có database
        return null;
        /*
        return reviewRepository.save(review);
        */
    }

    @Override
    public Review updateReview(Integer id,Review updateReview) {
        // Tạm thời return null - sẽ implement sau khi có database
        return null;
        /*
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
        */
    }

    @Override
    public boolean deleteReview(Integer id) {
        // Tạm thời return false - sẽ implement sau khi có database
        return false;
        /*
        if(reviewRepository.existsById(id)){
            reviewRepository.deleteById(id);
            return true;
        }
        return false;
        */
    }

    @Override
    public List<Review> findAllReviews() {
        // Tạm thời return empty list - sẽ implement sau khi có database
        return List.of();
        /*
        return reviewRepository.findAll();
        */
    }

    @Override
    public long getReviewCountByAccountId(Integer accountId) {
        // Không hardcode ở backend - sẽ được xử lý ở frontend
        if (accountId == null) {
            return 0;
        }
        // Return 0 - frontend sẽ xử lý hardcode
        return 0;
        
        /*
        return reviewRepository.countByAccountId(accountId);
        */
    }
}

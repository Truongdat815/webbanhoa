package org.example.website_sellflower.service.impl;

import org.example.website_sellflower.entity.Review;
import org.example.website_sellflower.repository.ReviewRepository;
import org.example.website_sellflower.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Override
    public Review createReview(Review review) {
        return reviewRepository.save(review);
    }

    @Override
    public Review updateReview(Integer id,Review updateReview) {
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
    public boolean deleteReview(Integer id) {
        if(reviewRepository.existsById(id)){
            reviewRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public List<Review> findAllReviews() {
        return reviewRepository.findAll();
    }
}

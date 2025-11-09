package org.example.website_sellflower.repository;

import org.example.website_sellflower.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    // ← THÊM MỚI: Tìm reviews theo productId với fetch join để load account
    @Query("SELECT r FROM Review r LEFT JOIN FETCH r.account WHERE r.product.id = :productId")
    List<Review> findByProductId(@Param("productId") Long productId);
    
    // Delete review by ID using native query
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Transactional
    @Query(value = "DELETE FROM [review] WHERE id = :id", nativeQuery = true)
    int deleteReviewByIdNative(@Param("id") Long id);
}
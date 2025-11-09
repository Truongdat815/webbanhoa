package org.example.website_sellflower.repository;

import org.example.website_sellflower.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review,Integer> {
    // ← THÊM MỚI: Tìm reviews theo productId
    List<Review> findByProductId(Long productId);
}
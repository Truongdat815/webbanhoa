package org.example.website_sellflower.repository;

import org.example.website_sellflower.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
// import org.springframework.stereotype.Repository;

// @Repository  // TẠM THỜI COMMENT - Sẽ uncomment khi có database
public interface ReviewRepository extends JpaRepository<Review,Integer> {
    @Query("SELECT COUNT(r) FROM Review r WHERE r.account.accountId = :accountId")
    long countByAccountId(@Param("accountId") Integer accountId);
}

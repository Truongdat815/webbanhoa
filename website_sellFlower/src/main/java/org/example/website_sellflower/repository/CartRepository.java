// File: src/main/java/org/example/website_sellflower/repository/CartRepository.java
package org.example.website_sellflower.repository;

import org.example.website_sellflower.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    @Query("SELECT c FROM Cart c LEFT JOIN FETCH c.items WHERE c.account.id = :accountId")
    Optional<Cart> findByAccountId(Long accountId);

    boolean existsByAccountId(Long accountId);
}
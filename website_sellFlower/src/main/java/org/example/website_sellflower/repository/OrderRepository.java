package org.example.website_sellflower.repository;

import org.example.website_sellflower.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    @Query("SELECT o FROM Order o WHERE o.account.accountId = :accountId ORDER BY o.orderDate DESC")
    List<Order> findByAccountId(@Param("accountId") Integer accountId);
}

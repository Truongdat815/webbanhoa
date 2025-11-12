package org.example.website_sellflower.repository;

import org.aspectj.weaver.ast.Or;
import org.example.website_sellflower.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByAccountId(Long accountId);

    @Query("SELECT o FROM Order o ORDER BY o.orderDate DESC")
    List<Order> getAllByOrderDateDesc();

    List<Order> findByStatus(String status);

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status = 'COMPLETED'")
    Double sumTotalAmount();
}
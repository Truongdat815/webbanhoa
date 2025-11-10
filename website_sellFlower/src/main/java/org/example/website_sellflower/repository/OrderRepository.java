package org.example.website_sellflower.repository;

import org.aspectj.weaver.ast.Or;
import org.example.website_sellflower.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByAccountId(Long accountId);

}
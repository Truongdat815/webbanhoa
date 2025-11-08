package org.example.website_sellflower.service;

import org.example.website_sellflower.entity.Order;

import java.util.List;

public interface OrderService {
    public List<Order> getAllOrders();
    public Order getOrderById(Long id);
    public Order createOrder(Order order);
    public Order updateOrder(Long id, Order order);
    public boolean deleteOrder(Long id);

    // ← THÊM MỚI
    public List<Order> findByAccountId(Long accountId);
}
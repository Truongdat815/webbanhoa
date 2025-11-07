package org.example.website_sellflower.service;

import org.example.website_sellflower.entity.Order;

import java.util.List;

public interface OrderService {
    public List<Order> getAllOrders();
    public Order getOrderById(Integer id);
    public Order createOrder(Order order);
    public Order updateOrder(Integer id, Order order);
    public boolean deleteOrder(Integer id);
    public List<Order> getOrdersByAccountId(Integer accountId);
}

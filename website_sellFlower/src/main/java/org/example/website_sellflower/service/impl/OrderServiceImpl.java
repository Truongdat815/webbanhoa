package org.example.website_sellflower.service.impl;

import org.example.website_sellflower.entity.Order;
import org.example.website_sellflower.repository.OrderRepository;
import org.example.website_sellflower.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {
    @Autowired(required = false)
    private OrderRepository repository;

    @Override
    public List<Order> getAllOrders() {
        if (repository == null) {
            return List.of();
        }
        return repository.findAll();
    }

    @Override
    public Order getOrderById(Integer id) {
        if (repository == null) {
            return null;
        }
        return repository.findById(id).orElse(null);
    }

    @Override
    public Order createOrder(Order order) {
        if (repository == null) {
            return null;
        }
        return repository.save(order);
    }

    @Override
    public Order updateOrder(Integer id, Order order) {
        if (repository == null) {
            return null;
        }
        Order existingOrder = repository.findById(id).orElse(null);
        if (existingOrder != null) {
            order.setOrderId(id);
            return repository.save(order);
        }
        return null;
    }

    @Override
    public boolean deleteOrder(Integer id) {
        if (repository == null) {
            return false;
        }
        Order existingOrder = repository.findById(id).orElse(null);
        if (existingOrder != null) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public List<Order> getOrdersByAccountId(Integer accountId) {
        if (repository == null || accountId == null) {
            return List.of();
        }
        return repository.findByAccountId(accountId);
    }
}

package org.example.website_sellflower.service.impl;

import org.example.website_sellflower.entity.Order;
import org.example.website_sellflower.repository.OrderRepository;
import org.example.website_sellflower.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {
    @Autowired
    private OrderRepository repository;

    @Override
    public List<Order> getAllOrders() {
        return repository.findAll();
    }

    @Override
    public Order getOrderById(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public Order createOrder(Order order) {
        return repository.save(order);
    }

    @Override
    public Order updateOrder(Long id, Order order) {
        Order existingOrder = repository.findById(id).orElse(null);
        if (existingOrder != null) {
            order.setOrderId(Math.toIntExact(id));
            return repository.save(order);
        }
        return null;
    }

    @Override
    public boolean deleteOrder(Long id) {
        Order existingOrder = repository.findById(id).orElse(null);
        if (existingOrder != null) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }
}
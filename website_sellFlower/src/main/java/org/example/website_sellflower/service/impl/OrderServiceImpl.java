package org.example.website_sellflower.service.impl;

import org.example.website_sellflower.entity.Order;
import org.example.website_sellflower.repository.OrderRepository;
import org.example.website_sellflower.service.OrderService;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;

import java.util.List;

// @Service  // TẠM THỜI COMMENT - Sẽ uncomment khi có database
public class OrderServiceImpl implements OrderService {
    // @Autowired  // TẠM THỜI COMMENT
    private OrderRepository repository;

    @Override
    public List<Order> getAllOrders() {
        // Tạm thời return empty list - sẽ implement sau khi có database
        return List.of();
        /*
        return repository.findAll();
        */
    }

    @Override
    public Order getOrderById(Long id) {
        // Tạm thời return null - sẽ implement sau khi có database
        return null;
        /*
        return repository.findById(id).orElse(null);
        */
    }

    @Override
    public Order createOrder(Order order) {
        // Tạm thời return null - sẽ implement sau khi có database
        return null;
        /*
        return repository.save(order);
        */
    }

    @Override
    public Order updateOrder(Long id, Order order) {
        // Tạm thời return null - sẽ implement sau khi có database
        return null;
        /*
        Order existingOrder = repository.findById(id).orElse(null);
        if (existingOrder != null) {
            order.setOrderId(Math.toIntExact(id));
            return repository.save(order);
        }
        return null;
        */
    }

    @Override
    public boolean deleteOrder(Long id) {
        // Tạm thời return false - sẽ implement sau khi có database
        return false;
        /*
        Order existingOrder = repository.findById(id).orElse(null);
        if (existingOrder != null) {
            repository.deleteById(id);
            return true;
        }
        return false;
        */
    }
}

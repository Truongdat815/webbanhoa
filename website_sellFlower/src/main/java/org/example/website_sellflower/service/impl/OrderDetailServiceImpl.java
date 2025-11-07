package org.example.website_sellflower.service.impl;

import org.example.website_sellflower.entity.OrderDetail;
import org.example.website_sellflower.repository.OrderDetailRepository;
import org.example.website_sellflower.service.OrderDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderDetailServiceImpl implements OrderDetailService {
    @Autowired(required = false)
    private OrderDetailRepository repository;

    @Override
    public boolean saveOrderDetail(OrderDetail orderDetail) {
        if (repository == null) {
            return false;
        }
        OrderDetail orderDetail1 = repository.save(orderDetail);
        return orderDetail1 != null;
    }

    @Override
    public boolean deleteOrderDetailByOrderDetailId(int orderDetailId) {
        if (repository == null) {
            return false;
        }
        OrderDetail orderDetail = repository.findById(orderDetailId).orElse(null);
        if (orderDetail != null) {
            repository.deleteById(orderDetailId);
            return true;
        }
        return false;
    }

    @Override
    public boolean updateOrderDetail(OrderDetail orderDetail) {
        if (repository == null) {
            return false;
        }
        OrderDetail existingOrderDetail = repository.findById(orderDetail.getOrderDetailId()).orElse(null);
        if (existingOrderDetail != null) {
            repository.save(orderDetail);
            return true;
        }
        return false;
    }

    @Override
    public OrderDetail getOrderDetailById(int orderDetailId) {
        if (repository == null) {
            return null;
        }
        return repository.findById(orderDetailId).orElse(null);
    }

    @Override
    public List<OrderDetail> getAllOrderDetailsByOrderId(int orderId) {
        if (repository == null) {
            return List.of();
        }
        return repository.findByOrderId(orderId);
    }
}

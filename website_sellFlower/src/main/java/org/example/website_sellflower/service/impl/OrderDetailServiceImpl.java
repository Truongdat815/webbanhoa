package org.example.website_sellflower.service.impl;

import org.example.website_sellflower.entity.OrderDetail;
import org.example.website_sellflower.repository.OrderDetailRepository;
import org.example.website_sellflower.service.OrderDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderDetailServiceImpl implements OrderDetailService {
    @Autowired
    private OrderDetailRepository repository;

    @Override
    public boolean saveOrderDetail(OrderDetail orderDetail) {
        OrderDetail orderDetail1 = repository.save(orderDetail);
        if (orderDetail1 != null) {
            return true;
        }
        return false;
    }

    @Override
    public boolean deleteOrderDetailByOrderDetailId(int orderDetailId) {
        OrderDetail orderDetail = repository.findById((long) orderDetailId).orElse(null);
        if (orderDetail != null) {
            repository.deleteById((long) orderDetailId);
            return true;
        }
        return false;
    }

    @Override
    public boolean updateOrderDetail(OrderDetail orderDetail) {
        OrderDetail existingOrderDetail = repository.findById((long) orderDetail.getOrderDetailId()).orElse(null);
        if (existingOrderDetail != null) {
            repository.save(orderDetail);
            return true;
        }
        return false;
    }

    @Override
    public OrderDetail getOrderDetailById(int orderDetailId) {
        return repository.findById((long) orderDetailId).orElse(null);
    }

    @Override
    public List<OrderDetail> getAllOrderDetailsByOrderId(int orderId) {
        return repository.findByOrderId((long) orderId);
    }
}
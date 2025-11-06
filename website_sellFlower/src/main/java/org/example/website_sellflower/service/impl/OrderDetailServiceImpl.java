package org.example.website_sellflower.service.impl;

import org.example.website_sellflower.entity.OrderDetail;
import org.example.website_sellflower.repository.OrderDetailRepository;
import org.example.website_sellflower.service.OrderDetailService;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;

import java.util.List;

// @Service  // TẠM THỜI COMMENT - Sẽ uncomment khi có database
public class OrderDetailServiceImpl implements OrderDetailService {
    // @Autowired  // TẠM THỜI COMMENT
    private OrderDetailRepository repository;

    @Override
    public boolean saveOrderDetail(OrderDetail orderDetail) {
        // Tạm thời return false - sẽ implement sau khi có database
        return false;
        /*
        OrderDetail orderDetail1 = repository.save(orderDetail);
        if (orderDetail1 != null) {
            return true;
        }
        return false;
        */
    }

    @Override
    public boolean deleteOrderDetailByOrderDetailId(int orderDetailId) {
        // Tạm thời return false - sẽ implement sau khi có database
        return false;
        /*
        OrderDetail orderDetail = repository.findById((long) orderDetailId).orElse(null);
        if (orderDetail != null) {
            repository.deleteById((long) orderDetailId);
            return true;
        }
        return false;
        */
    }

    @Override
    public boolean updateOrderDetail(OrderDetail orderDetail) {
        // Tạm thời return false - sẽ implement sau khi có database
        return false;
        /*
        OrderDetail existingOrderDetail = repository.findById((long) orderDetail.getOrderDetailId()).orElse(null);
        if (existingOrderDetail != null) {
            repository.save(orderDetail);
            return true;
        }
        return false;
        */
    }

    @Override
    public OrderDetail getOrderDetailById(int orderDetailId) {
        // Tạm thời return null - sẽ implement sau khi có database
        return null;
        /*
        return repository.findById((long) orderDetailId).orElse(null);
        */
    }

    @Override
    public List<OrderDetail> getAllOrderDetailsByOrderId(int orderId) {
        // Tạm thời return empty list - sẽ implement sau khi có database
        return List.of();
        /*
        return repository.findByOrderId((long) orderId);
        */
    }
}

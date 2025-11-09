package org.example.website_sellflower.service;

import org.example.website_sellflower.entity.OrderDetail;

import java.util.List;

public interface OrderDetailService {
    public boolean saveOrderDetail(OrderDetail orderDetail);
    public boolean deleteOrderDetailById(Long orderDetailId);
    public boolean updateOrderDetail(OrderDetail orderDetail);
    public OrderDetail getOrderDetailById(Long orderDetailId);
    public List<OrderDetail> getAllOrderDetailsById(Long orderId);


}
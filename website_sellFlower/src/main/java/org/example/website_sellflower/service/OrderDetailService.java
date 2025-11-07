package org.example.website_sellflower.service;

import org.example.website_sellflower.entity.OrderDetail;

import java.util.List;

public interface OrderDetailService {
    public boolean saveOrderDetail(OrderDetail orderDetail);
    public boolean deleteOrderDetailById(int orderDetailId);
    public boolean updateOrderDetail(OrderDetail orderDetail);
    public OrderDetail getOrderDetailById(int orderDetailId);
    public List<OrderDetail> getAllOrderDetailsById(int orderId);


}
package org.example.website_sellflower.service;

import org.example.website_sellflower.entity.OrderDetail;

import java.util.List;

public interface OrderDetailService {
    public boolean saveOrderDetail(OrderDetail orderDetail);
    public boolean deleteOrderDetailByOrderDetailId(int orderDetailId);
    public boolean updateOrderDetail(OrderDetail orderDetail);
    public OrderDetail getOrderDetailById(int orderDetailId);
    public List<OrderDetail> getAllOrderDetailsByOrderId(int orderId);


}
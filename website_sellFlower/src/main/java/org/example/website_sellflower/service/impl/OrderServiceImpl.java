package org.example.website_sellflower.service.Impl;

import org.example.website_sellflower.entity.Order;
import org.example.website_sellflower.entity.OrderDetail;
import org.example.website_sellflower.entity.Product;
import org.example.website_sellflower.repository.OrderRepository;
import org.example.website_sellflower.repository.ProductRepository;
import org.example.website_sellflower.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {
    @Autowired
    private OrderRepository repository;

    // cần ProductRepository để kiểm tra và giảm stock
    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<Order> getAllOrders() {
        return repository.getAllByOrderDateDesc();
    }

    @Override
    public Order getOrderById(Long id) {
        return repository.findById(id).orElse(null);
    }

    /**
     * Create order transactionally: validate stock, decrement stock, set prices from DB,
     * then persist the Order (assumes cascade persist to OrderDetail).
     */
    @Override
    @Transactional
    public Order createOrder(Order order) {
        if (order == null) {
            throw new IllegalArgumentException("Order is null");
        }

        List<OrderDetail> details = order.getOrderDetails();
        if (details == null || details.isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least one OrderDetail");
        }

        double total = 0.0;

        for (OrderDetail od : details) {
            if (od == null || od.getProduct() == null || od.getProduct().getId() == null) {
                throw new IllegalArgumentException("OrderDetail or Product id is null");
            }

            Long pid = od.getProduct().getId();
            Product prod = productRepository.findById(pid)
                    .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại: id=" + pid));

            int qty = od.getQuantity() == null ? 0 : od.getQuantity();
            if (qty <= 0) {
                throw new RuntimeException("Số lượng không hợp lệ cho sản phẩm: " + prod.getName());
            }

            // Kiểm tra tồn kho (tên trường stockQuantity có thể khác — sửa theo entity của bạn)
            Integer stock = prod.getStockQuantity();
            if (stock != null && stock < qty) {
                throw new RuntimeException("Không đủ hàng cho sản phẩm: " + prod.getName());
            }

            // Giảm tồn kho
            if (stock != null) {
                prod.setStockQuantity(stock - qty);
            }
            productRepository.save(prod);

            // Gán lại product quản lý (managed), order, và cập nhật giá hiện tại từ DB
            od.setProduct(prod);
            od.setOrder(order);
            od.setPrice(prod.getPrice());

            total += (prod.getPrice() != null ? prod.getPrice() : 0.0) * qty;
        }

        order.setTotalAmount(total);

        // Lưu order (giả định Order có cascade ALL tới OrderDetail)
        return repository.save(order);
    }

    @Override
    public Order updateOrder(Long id, Order order) {
        Order existingOrder = repository.findById(id).orElse(null);
        if (existingOrder != null) {
            order.setId(id);
            return repository.save(order);
        }
        return null;
    }

    @Override
    public boolean deleteOrder(Long id) {
        try {
            Order existingOrder = repository.findById(id).orElse(null);
            if (existingOrder != null) {
                // Cascade sẽ xóa OrderDetail nếu cấu hình đúng
                repository.delete(existingOrder);
                return true;
            }
            return false;
        } catch (Exception e) {
            System.err.println("Error deleting order: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Không thể xóa đơn hàng: " + e.getMessage(), e);
        }
    }

    @Override
    public List<Order> findByStatus(String status) {
        return repository.findByStatus(status);
    }

    @Override
    public List<Order> findByAccountId(Long accountId) {
        return repository.findByAccountId(accountId);
    }
}
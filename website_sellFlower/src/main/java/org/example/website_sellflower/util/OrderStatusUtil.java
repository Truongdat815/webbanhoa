package org.example.website_sellflower.util;

import java.util.HashMap;
import java.util.Map;

public class OrderStatusUtil {
    
    // Status constants in English (for database)
    public static final String PENDING_PAYMENT = "pending_payment";
    public static final String PAID = "paid";
    public static final String PROCESSING = "processing";
    public static final String SHIPPED = "shipped";
    public static final String DELIVERED = "delivered";
    public static final String CANCELLED = "cancelled";
    
    // Status mapping: English (DB) -> Vietnamese (UI)
    private static final Map<String, String> STATUS_MAP = new HashMap<>();
    
    static {
        STATUS_MAP.put(PENDING_PAYMENT, "Chờ thanh toán");
        STATUS_MAP.put(PAID, "Đã thanh toán");
        STATUS_MAP.put(PROCESSING, "Đang xử lý");
        STATUS_MAP.put(SHIPPED, "Đã gửi hàng");
        STATUS_MAP.put(DELIVERED, "Đã giao hàng");
        STATUS_MAP.put(CANCELLED, "Đã hủy");
    }
    
    /**
     * Convert order status from English (database) to Vietnamese (UI display)
     * @param status English status from database
     * @return Vietnamese status for UI, or the original status if not found
     */
    public static String getStatusInVietnamese(String status) {
        if (status == null) {
            return "Không xác định";
        }
        return STATUS_MAP.getOrDefault(status, status);
    }
    
    /**
     * Get all status mappings
     * @return Map of status mappings
     */
    public static Map<String, String> getAllStatusMappings() {
        return new HashMap<>(STATUS_MAP);
    }
}


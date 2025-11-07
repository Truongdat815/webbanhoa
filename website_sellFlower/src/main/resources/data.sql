-- Data initialization script for website_sellFlower
-- This file will be executed automatically by Spring Boot on application startup

-- Insert sample products
INSERT INTO product (id, name, description, price, stock_quantity, image_url, category) VALUES
(1, 'Hoa hồng đỏ', 'Bó hoa hồng đỏ tươi thắm, biểu tượng của tình yêu', 150000, 50, 'https://i.pravatar.cc/300', 'Hoa hồng'),
(2, 'Hoa tulip vàng', 'Hoa tulip vàng rực rỡ, mang ý nghĩa may mắn', 120000, 30, 'https://i.pravatar.cc/300', 'Hoa tulip'),
(3, 'Hoa ly trắng', 'Hoa ly trắng tinh khôi, tượng trưng cho sự thuần khiết', 200000, 25, 'https://i.pravatar.cc/300', 'Hoa ly'),
(4, 'Hoa cúc họa mi', 'Hoa cúc họa mi nhỏ xinh, phù hợp làm quà tặng', 80000, 40, 'https://i.pravatar.cc/300', 'Hoa cúc'),
(5, 'Hoa hướng dương', 'Hoa hướng dương tươi sáng, mang năng lượng tích cực', 100000, 35, 'https://i.pravatar.cc/300', 'Hoa hướng dương');

-- Insert sample accounts
INSERT INTO account (id, username, email, password, full_name, phone, address, role, created_date) VALUES
(1, 'admin', 'admin@flowershop.com', '12345', 'Administrator', '0901234567', '123 Đường Nguyễn Văn Linh, TP.HCM', 'ADMIN', CURRENT_TIMESTAMP),
(2, 'user1', 'user1@email.com', '123456', 'Nguyễn Văn A', '0987654321', '456 Đường Lê Lợi, TP.HCM', 'USER', CURRENT_TIMESTAMP),
(3, 'user2', 'user2@email.com', '12345678', 'Trần Thị B', '0912345678', '789 Đường Trần Hưng Đạo, TP.HCM', 'USER', CURRENT_TIMESTAMP);

-- Insert sample orders
INSERT INTO order_table (id, account_id, order_date, total_amount, status, shipping_address, phone) VALUES
(1, 2, CURRENT_TIMESTAMP, 270000, 'COMPLETED', '456 Đường Lê Lợi, TP.HCM', '0987654321'),
(2, 3, CURRENT_TIMESTAMP, 200000, 'PROCESSING', '789 Đường Trần Hưng Đạo, TP.HCM', '0912345678');

-- Insert sample order details
INSERT INTO order_detail (id, order_id, product_id, quantity, price) VALUES
(1, 1, 1, 1, 150000),
(2, 1, 2, 1, 120000),
(3, 2, 3, 1, 200000);

-- Insert sample reviews
INSERT INTO review (id, product_id, account_id, rating, comment, review_date) VALUES
(1, 1, 2, 5, 'Hoa rất đẹp và tươi, giao hàng nhanh!', CURRENT_TIMESTAMP),
(2, 2, 3, 4, 'Hoa tulip đẹp nhưng hơi nhỏ so với mong đợi', CURRENT_TIMESTAMP),
(3, 3, 2, 5, 'Hoa ly trắng rất thơm và đẹp, sẽ mua lại', CURRENT_TIMESTAMP);

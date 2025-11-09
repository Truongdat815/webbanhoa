-- Data initialization script for website_sellFlower
-- This file will be executed automatically by Spring Boot on application startup

-- Insert sample products
INSERT INTO product (name, description, price, stock_quantity, image_url, category) VALUES
('Hoa hồng đỏ', 'Bó hoa hồng đỏ tươi thắm, biểu tượng của tình yêu', 150000, 50, 'https://i.pravatar.cc/300', 'Hoa hồng'),
('Hoa tulip vàng', 'Hoa tulip vàng rực rỡ, mang ý nghĩa may mắn', 120000, 30, 'https://i.pravatar.cc/300', 'Hoa tulip'),
('Hoa ly trắng', 'Hoa ly trắng tinh khôi, tượng trưng cho sự thuần khiết', 200000, 25, 'https://i.pravatar.cc/300', 'Hoa ly'),
('Hoa cúc họa mi', 'Hoa cúc họa mi nhỏ xinh, phù hợp làm quà tặng', 80000, 40, 'https://i.pravatar.cc/300', 'Hoa cúc'),
('Hoa hướng dương', 'Hoa hướng dương tươi sáng, mang năng lượng tích cực', 100000, 35, 'https://i.pravatar.cc/300', 'Hoa hướng dương'),
('Hoa hồng trắng', 'Bó hoa hồng trắng tinh khôi, biểu tượng của sự trong sáng', 160000, 45, 'https://i.pravatar.cc/300', 'Hoa hồng'),
('Hoa tulip đỏ', 'Hoa tulip đỏ rực rỡ, mang ý nghĩa đam mê', 125000, 28, 'https://i.pravatar.cc/300', 'Hoa tulip'),
('Hoa cẩm chướng hồng', 'Hoa cẩm chướng hồng ngọt ngào, tặng mẹ rất ý nghĩa', 90000, 50, 'https://i.pravatar.cc/300', 'Hoa cẩm chướng'),
('Hoa lan tím', 'Hoa lan tím quý phái, tượng trưng cho sự sang trọng', 300000, 15, 'https://i.pravatar.cc/300', 'Hoa lan'),
('Hoa baby mix', 'Hoa baby nhiều màu sắc, trang trí tiệc cưới lý tưởng', 70000, 60, 'https://i.pravatar.cc/300', 'Hoa baby'),
('Hoa đồng tiền cam', 'Hoa đồng tiền cam tươi sáng, mang lại niềm vui', 110000, 30, 'https://i.pravatar.cc/300', 'Hoa đồng tiền'),
('Hoa lavender', 'Hoa lavender thơm dịu nhẹ, giúp thư giãn tinh thần', 95000, 25, 'https://i.pravatar.cc/300', 'Hoa lavender');

-- Insert sample accounts
INSERT INTO account (username, email, password, full_name, phone, address, role, created_date) VALUES
('admin', 'admin@flowershop.com', '12345', 'Administrator', '0901234567', '123 Đường Nguyễn Văn Linh, TP.HCM', 'ADMIN', CURRENT_TIMESTAMP),
('user1', 'user1@email.com', '123456', 'Nguyễn Văn A', '0987654321', '456 Đường Lê Lợi, TP.HCM', 'USER', CURRENT_TIMESTAMP),
('user2', 'user2@email.com', '12345678', 'Trần Thị B', '0912345678', '789 Đường Trần Hưng Đạo, TP.HCM', 'USER', CURRENT_TIMESTAMP);

-- Insert sample orders
INSERT INTO order_table (account_id, order_date, total_amount, status, shipping_address, phone) VALUES
(2, CURRENT_TIMESTAMP, 270000, 'COMPLETED', '456 Đường Lê Lợi, TP.HCM', '0987654321'),
(3, CURRENT_TIMESTAMP, 200000, 'PROCESSING', '789 Đường Trần Hưng Đạo, TP.HCM', '0912345678');

-- Insert sample order details
INSERT INTO order_detail (order_id, product_id, quantity, price) VALUES
(1, 1, 1, 150000),
(1, 2, 1, 120000),
(2, 3, 1, 200000);

-- Insert sample reviews
INSERT INTO review (product_id, account_id, rating, comment, review_date) VALUES
(1, 2, 5, 'Hoa rất đẹp và tươi, giao hàng nhanh!', CURRENT_TIMESTAMP),
(2, 3, 4, 'Hoa tulip đẹp nhưng hơi nhỏ so với mong đợi', CURRENT_TIMESTAMP),
(3, 2, 5, 'Hoa ly trắng rất thơm và đẹp, sẽ mua lại', CURRENT_TIMESTAMP);

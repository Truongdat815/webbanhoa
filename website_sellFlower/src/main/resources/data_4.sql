-- Data initialization script for website_sellFlower
-- This file will be executed automatically by Spring Boot on application startup

-- Insert sample products
INSERT INTO product (name, description, price, stock_quantity, image_url) VALUES
(N'Hoa hồng đỏ', N'Bó hoa hồng đỏ tươi thắm, biểu tượng của tình yêu', 150000, 50, 'https://i.pinimg.com/736x/41/76/92/417692b48bf67c14ad665effe693866a.jpg'),
(N'Hoa tulip vàng', N'Hoa tulip vàng rực rỡ, mang ý nghĩa may mắn', 120000, 30, 'https://i.pinimg.com/736x/ab/a7/e8/aba7e806b3c9adf4c570112ebee82d0f.jpg'),
(N'Hoa ly trắng', N'Hoa ly trắng tinh khôi, tượng trưng cho sự thuần khiết', 200000, 25, 'https://i.pinimg.com/736x/14/d0/12/14d0126af345657da1127ddbf63d98c8.jpg'),
(N'Hoa cúc họa mi', N'Hoa cúc họa mi nhỏ xinh, phù hợp làm quà tặng', 80000, 40, 'https://i.pinimg.com/1200x/43/0b/9d/430b9df34a1238b07047edbf2d1499e9.jpg'),
(N'Hoa hướng dương', N'Hoa hướng dương tươi sáng, mang năng lượng tích cực', 100000, 35, 'https://i.pinimg.com/1200x/bc/ef/3d/bcef3d2ad25accd68df4aeb9215f3503.jpg'),
(N'Hoa hồng trắng', N'Bó hoa hồng trắng tinh khôi, biểu tượng của sự trong sáng', 160000, 45, 'https://i.pinimg.com/736x/fc/98/67/fc98672ec8121f08b9d30717cc02bee3.jpg'),
(N'Hoa tulip đỏ', N'Hoa tulip đỏ rực rỡ, mang ý nghĩa đam mê', 125000, 28, 'https://i.pinimg.com/1200x/90/49/a1/9049a1d97734ca5d3152d39bd335fc8b.jpg'),
(N'Hoa cẩm chướng hồng', N'Hoa cẩm chướng hồng ngọt ngào, tặng mẹ rất ý nghĩa', 90000, 50, 'https://i.pinimg.com/1200x/5f/2f/d8/5f2fd89f642a94e33c0ebeb03df2f3f0.jpg'),
(N'Hoa thược dược', N'Hoa thược dược quý phái, tượng trưng cho sự sang trọng', 300000, 15, 'https://i.pinimg.com/736x/e6/b9/3b/e6b93bfd05a63d129eec9345a2eba153.jpg'),
(N'Hoa baby mix', N'Hoa baby nhiều màu sắc, trang trí tiệc cưới lý tưởng', 70000, 60, 'https://i.pinimg.com/736x/be/79/62/be79625a94b526b89d2d23a703ea06a7.jpg'),
(N'Hoa đồng tiền cam', N'Hoa đồng tiền cam tươi sáng, mang lại niềm vui', 110000, 30, 'https://i.pinimg.com/1200x/50/89/1e/50891e0490ba1125f3d7102a990f12f5.jpg'),
(N'Hoa lavender', N'Hoa lavender thơm dịu nhẹ, giúp thư giãn tinh thần', 95000, 25, 'https://i.pinimg.com/1200x/64/9e/85/649e85d91161e5996c36deaf626c5f53.jpg');

-- Insert sample accounts
INSERT INTO account (username, email, password, full_name, phone, address, role, created_date,status) VALUES
                                                                                                          ('admin', 'admin@flowershop.com', '12345', N'Administrator', '0901234567', N'123 Đường Nguyễn Văn Linh, TP.HCM', 'ADMIN', CURRENT_TIMESTAMP, 'ACTIVE'),
                                                                                                          ('user1', 'user1@email.com', '123456', N'Nguyễn Văn A', '0987654321', N'456 Đường Lê Lợi, TP.HCM', 'USER', CURRENT_TIMESTAMP, 'ACTIVE'),
                                                                                                          ('user2', 'user2@email.com', '12345678', N'Trần Thị B', '0912345678', N'789 Đường Trần Hưng Đạo, TP.HCM', 'USER', CURRENT_TIMESTAMP, 'ACTIVE'),
                                                                                                          ('user3', 'user3@email.com', 'password123', N'Lê Văn C', '0923456789', N'101 Đường Pasteur, Quận 1, TP.HCM', 'USER', CURRENT_TIMESTAMP, 'ACTIVE'),
                                                                                                          ('user4', 'user4@email.com', 'mypass456', N'Phạm Thị D', '0934567890', N'202 Đường Điện Biên Phủ, Quận 3, TP.HCM', 'USER', CURRENT_TIMESTAMP, 'ACTIVE'),
                                                                                                          ('user5', 'user5@email.com', 'secure789', N'Hoàng Minh E', '0945678901', N'303 Đường Võ Văn Tần, Quận 3, TP.HCM', 'USER', CURRENT_TIMESTAMP, 'ACTIVE');

-- Insert sample orders (không sử dụng account_id = 1 do admin không mua hàng)
INSERT INTO order_table (account_id, order_date, total_amount, status, shipping_address, phone, recipient_name) VALUES
(2, CURRENT_TIMESTAMP, 270000, 'COMPLETED', N'456 Đường Lê Lợi, TP.HCM', '0987654321', N'Phạm Thị A'),
(3, CURRENT_TIMESTAMP, 200000, 'COMPLETED', N'789 Đường Trần Hưng Đạo, TP.HCM', '0912345678', N'Nguyễn Văn B'),
(4, CURRENT_TIMESTAMP, 450000, 'COMPLETED', N'101 Đường Pasteur, Quận 1, TP.HCM', '0923456789', N'Lê Thị C'),
(2, CURRENT_TIMESTAMP, 380000, 'COMPLETED', N'456 Đường Lê Lợi, TP.HCM', '0987654321', N'Vũ Thị A'),
(5, CURRENT_TIMESTAMP, 320000, 'COMPLETED', N'202 Đường Điện Biên Phủ, Quận 3, TP.HCM', '0934567890', N'Trần Văn D'),
(6, CURRENT_TIMESTAMP, 280000, 'COMPLETED', N'303 Đường Võ Văn Tần, Quận 3, TP.HCM', '0945678901', 'Hoàng Thị E'),
(3, CURRENT_TIMESTAMP, 190000, 'COMPLETED', N'789 Đường Trần Hưng Đạo, TP.HCM', '0912345678', N'Hồ Văn B'),
(4, CURRENT_TIMESTAMP, 410000, 'COMPLETED', N'101 Đường Pasteur, Quận 1, TP.HCM', '0923456789', N'La Thị E'),
(5, CURRENT_TIMESTAMP, 350000, 'COMPLETED', N'202 Đường Điện Biên Phủ, Quận 3, TP.HCM', '0934567890', N'Trần Nguyên D'),
(6, CURRENT_TIMESTAMP, 220000, 'COMPLETED', N'303 Đường Võ Văn Tần, Quận 3, TP.HCM', '0945678901', 'Hoàng Lê E');

-- Insert sample order details (more comprehensive data for best-selling analysis)
INSERT INTO order_detail (order_id, product_id, quantity, price) VALUES
-- Order 1 - user1
(1, 1, 1, 150000),
(1, 2, 1, 120000),
-- Order 2 - user2
(2, 3, 1, 200000),
-- Order 3 - user3
(3, 1, 2, 150000), -- Hoa hồng đỏ - 2 bó
(3, 9, 1, 150000), -- Hoa thược dược - 1 bó
-- Order 4 - user1's second order
(4, 1, 1, 150000), -- Hoa hồng đỏ lại được mua
(4, 5, 1, 100000), -- Hoa hướng dương
(4, 7, 1, 130000), -- Hoa tulip đỏ
-- Order 5 - user4's order
(5, 2, 2, 120000), -- Hoa tulip vàng - 2 bó
(5, 4, 1, 80000),  -- Hoa cúc họa mi
-- Order 6 - user5's order
(6, 1, 1, 150000), -- Hoa hồng đỏ tiếp tục bán chạy
(6, 6, 1, 130000), -- Hoa hồng trắng
-- Order 7 - user2's second order
(7, 5, 1, 100000), -- Hoa hướng dương
(7, 11, 1, 90000), -- Hoa đồng tiền cam
-- Order 8 - user3's second order
(8, 9, 1, 300000), -- Hoa thược dược
(8, 2, 1, 110000), -- Hoa tulip vàng
-- Order 9 - user4's second order
(9, 3, 1, 200000), -- Hoa ly trắng
(9, 8, 1, 90000),  -- Hoa cẩm chướng hồng
(9, 12, 1, 60000), -- Hoa lavender
-- Order 10 - user5's second order
(10, 5, 1, 100000), -- Hoa hướng dương
(10, 10, 2, 60000); -- Hoa baby mix - 2 bó

-- Insert more comprehensive reviews for high-rating analysis (không có admin review)
INSERT INTO review (product_id, account_id, rating, comment, review_date, status) VALUES
-- Reviews từ user1 (account_id = 2)
(1, 2, 5, N'Hoa rất đẹp và tươi, giao hàng nhanh!', CURRENT_TIMESTAMP, 'APPROVED'),
(5, 2, 5, N'Hoa hướng dương tràn đầy năng lượng, rất thích!', CURRENT_TIMESTAMP, 'APPROVED'),
(7, 2, 4, N'Hoa tulip đỏ đẹp nhưng cần cải thiện bao bì', CURRENT_TIMESTAMP, 'PENDING'),
-- Reviews từ user2 (account_id = 3)
(2, 3, 4, N'Hoa tulip vàng đẹp nhưng hơi nhỏ so với mong đợi', CURRENT_TIMESTAMP, 'APPROVED'),
(3, 3, 5, N'Hoa ly trắng rất thơm và đẹp, sẽ mua lại', CURRENT_TIMESTAMP, 'APPROVED'),
(5, 3, 5, N'Chất lượng tuyệt vời, sẽ giới thiệu cho bạn bè', CURRENT_TIMESTAMP, 'APPROVED'),
(11, 3, 4, N'Hoa đồng tiền cam tươi sáng', CURRENT_TIMESTAMP, 'APPROVED'),
-- Reviews từ user3 (account_id = 4)
(1, 4, 5, N'Hoa hồng đỏ tuyệt vời, khách hàng rất hài lòng!', CURRENT_TIMESTAMP, 'APPROVED'),
(9, 4, 5, N'Hoa thược dược sang trọng, xứng đáng với giá tiền', CURRENT_TIMESTAMP, 'APPROVED'),
(2, 4, 5, N'Hoa tulip vàng rất đẹp, ý nghĩa tốt', CURRENT_TIMESTAMP, 'APPROVED'),
-- Reviews từ user4 (account_id = 5)
(2, 5, 4, N'Hoa tulip vàng tươi nhưng cần cải thiện bao bì', CURRENT_TIMESTAMP, 'PENDING'),
(4, 5, 4, N'Hoa cúc họa mi xinh xắn, giá hợp lý', CURRENT_TIMESTAMP, 'APPROVED'),
(3, 5, 5, N'Hoa ly trắng thuần khiết, rất ý nghĩa', CURRENT_TIMESTAMP, 'APPROVED'),
(8, 5, 4, N'Hoa cẩm chướng hồng thích hợp tặng mẹ', CURRENT_TIMESTAMP, 'APPROVED'),
(12, 5, 4, N'Hoa lavender thơm nhẹ, thư giãn', CURRENT_TIMESTAMP, 'APPROVED'),
-- Reviews từ user5 (account_id = 6)
(1, 6, 5, N'Chất lượng tốt, màu sắc tươi sáng', CURRENT_TIMESTAMP, 'APPROVED'),
(6, 6, 5, N'Hoa hồng trắng tinh khôi, rất đẹp', CURRENT_TIMESTAMP, 'APPROVED'),
(5, 6, 5, N'Màu vàng tươi sáng, mang lại cảm giác vui vẻ', CURRENT_TIMESTAMP, 'APPROVED'),
(10, 6, 3, N'Hoa baby mix trang trí ổn nhưng hơi mỏng', CURRENT_TIMESTAMP, 'REJECTED'),
-- Thêm reviews cho các sản phẩm khác
(4, 2, 4, N'Hoa nhỏ nhưng dễ thương, phù hợp làm quà', CURRENT_TIMESTAMP, 'PENDING'),
(7, 4, 4, N'Hoa tulip đỏ đậm đà, ý nghĩa tốt', CURRENT_TIMESTAMP, 'APPROVED'),
(9, 6, 5, N'Chất lượng cao cấp, rất đẹp', CURRENT_TIMESTAMP, 'APPROVED'),
(3, 3, 4, N'Hoa ly đẹp nhưng giá hơi cao', CURRENT_TIMESTAMP, 'PENDING');

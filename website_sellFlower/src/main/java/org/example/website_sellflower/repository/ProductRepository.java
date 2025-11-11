package org.example.website_sellflower.repository;

import org.example.website_sellflower.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query(value = "SELECT TOP(:numberOfProducts) * FROM product p WHERE p.stock_quantity > 0 ORDER BY p.id DESC", nativeQuery = true)
    List<Product> getLatestProducts(@Param("numberOfProducts") int numberOfProducts);

    @Query(value = "SELECT TOP(:numberOfProducts) p.id, p.name, p.description, p.price, p.stock_quantity, p.image_url FROM product p " +
            "JOIN order_detail od ON p.id = od.product_id " +
            "JOIN order_table o ON o.id = od.order_id " +
            "WHERE o.status = 'COMPLETED' and p.stock_quantity > 0" +
            "GROUP BY p.id, p.name, p.description, p.price, p.stock_quantity, p.image_url " +
            "ORDER BY SUM(od.quantity) DESC", nativeQuery = true)
    List<Product> getTopProductsByOrderByIdDesc(@Param("numberOfProducts") int numberOfProducts);

    @Query(value = "SELECT TOP(:numberOfProducts) p.id, p.name, p.description, p.price, p.stock_quantity, p.image_url FROM product p " +
            "JOIN review r ON p.id = r.product_id " +
            "WHERE p.stock_quantity > 0 " +
            "GROUP BY p.id, p.name, p.description, p.price, p.stock_quantity, p.image_url " +
            "ORDER BY AVG(CAST(r.rating AS FLOAT)) DESC", nativeQuery = true)
    List<Product> getTopProminentProducts(@Param("numberOfProducts") int numberOfProducts);
}
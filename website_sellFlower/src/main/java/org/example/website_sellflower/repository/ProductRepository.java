package org.example.website_sellflower.repository;

import org.example.website_sellflower.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.stereotype.Repository;

// @Repository  // TẠM THỜI COMMENT - Sẽ uncomment khi có database
public interface ProductRepository extends JpaRepository<Product,Integer> {
}

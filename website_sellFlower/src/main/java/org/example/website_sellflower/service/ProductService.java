package org.example.website_sellflower.service;

import org.example.website_sellflower.entity.Product;

import java.util.List;

public interface ProductService {
    Product createProduct(Product product);
    List<Product> findAllProducts();
    Product updateProduct(Integer id,Product product);
    boolean deleteProduct(Integer id);
    // ← THÊM MỚI
    Product findProductById(Long id);

    List<Product> getLatestProducts(int numberOfProducts);

    List<Product> getTopProductsByOrderByIdDesc(int numberOfProducts);
    List<Product> getTopProminentProducts(int numberOfProducts);
}
package org.example.website_sellflower.service.Impl;

import org.example.website_sellflower.entity.Product;
import org.example.website_sellflower.repository.ProductRepository;
import org.example.website_sellflower.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    public List<Product> findAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Product updateProduct(Long id, Product updateproduct) {
        Optional<Product> existingProduct = productRepository.findById(id);
        if(existingProduct.isPresent()) {
            Product product = existingProduct.get();
            product.setName(updateproduct.getName());
            product.setDescription(updateproduct.getDescription());
            product.setPrice(updateproduct.getPrice());
            product.setStockQuantity(updateproduct.getStockQuantity());
            product.setImageUrl(updateproduct.getImageUrl());
            product.setCategory(updateproduct.getCategory());

            return productRepository.save(product);
        }
        return null;
    }

    @Override
    public Product deleteProduct(Long id) {
        try {
            Product product = productRepository.findById(id).orElse(null);
            if (product != null) {
                // Check if product is used in any order
                // If product has reviews, cascade will handle it
                // But if product is in order_details, we need to handle it
//                productRepository.delete(product);
                product.setStockQuantity(0);
                return productRepository.save(product);
            }
            return null;
        } catch (Exception e) {
            System.err.println("Error deleting product: " + e.getMessage());
            e.printStackTrace();
            // Check if it's a foreign key constraint error
            if (e.getMessage() != null && e.getMessage().contains("foreign key")) {
                throw new RuntimeException("Không thể xóa sản phẩm vì đã có đơn hàng sử dụng sản phẩm này", e);
            }
            throw new RuntimeException("Không thể xóa sản phẩm: " + e.getMessage(), e);
        }
    }
    // ← THÊM MỚI
    @Override
    public Product findProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    @Override
    public List<Product> getLatestProducts(int numberOfProducts) {
        return productRepository.getLatestProducts(numberOfProducts);
    }

    @Override
    public List<Product> getTopProductsByOrderByIdDesc(int numberOfProducts) {
        return productRepository.getTopProductsByOrderByIdDesc(numberOfProducts);
    }

    @Override
    public List<Product> getTopProminentProducts(int numberOfProducts) {
        return productRepository.getTopProminentProducts(numberOfProducts);
    }
}
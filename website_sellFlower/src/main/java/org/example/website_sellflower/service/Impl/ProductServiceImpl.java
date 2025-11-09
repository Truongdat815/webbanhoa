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
    public boolean deleteProduct(Long id) {
        if(productRepository.existsById(id)){
            productRepository.deleteById(id);
            return true;
        }
        return false;
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
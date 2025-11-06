package org.example.website_sellflower.service.impl;

import org.example.website_sellflower.entity.Product;
import org.example.website_sellflower.repository.ProductRepository;
import org.example.website_sellflower.service.ProductService;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

// @Service  // TẠM THỜI COMMENT - Sẽ uncomment khi có database
public class ProductServiceImpl implements ProductService {

    // @Autowired  // TẠM THỜI COMMENT
    private ProductRepository productRepository;

    @Override
    public Product createProduct(Product product) {
        // Tạm thời return null - sẽ implement sau khi có database
        return null;
        /*
        return productRepository.save(product);
        */
    }

    @Override
    public List<Product> findAllProducts() {
        // Tạm thời return empty list - sẽ implement sau khi có database
        return List.of();
        /*
        return productRepository.findAll();
        */
    }

    @Override
    public Product updateProduct(Integer id, Product updateproduct) {
        // Tạm thời return null - sẽ implement sau khi có database
        return null;
        /*
        Optional<Product> existingProduct = productRepository.findById(id);
        if(existingProduct.isPresent()) {
            Product product = existingProduct.get();
            product.setProductName(updateproduct.getProductName());
            product.setDescription(updateproduct.getDescription());
            product.setPrice(updateproduct.getPrice());
            product.setStock(updateproduct.getStock());
            product.setImageUrl(updateproduct.getImageUrl());
            product.setCategory(updateproduct.getCategory());
            product.setCreateAt(updateproduct.getCreateAt());
             return productRepository.save(product);
        }
        return null;
        */
    }

    @Override
    public boolean deleteProduct(Integer id) {
        // Tạm thời return false - sẽ implement sau khi có database
        return false;
        /*
        if(productRepository.existsById(id)){
            productRepository.deleteById(id);
            return true;
        }
        return false;
        */
    }
}

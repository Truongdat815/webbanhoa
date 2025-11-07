package org.example.website_sellflower.dto;

import java.math.BigDecimal;

public class CartItemDTO {
    private Integer productId;
    private String productName;
    private BigDecimal price;
    private Integer quantity;
    private String imageUrl;
    private Integer stock;

    public CartItemDTO() {
    }

    public CartItemDTO(Integer productId, String productName, BigDecimal price, Integer quantity, String imageUrl, Integer stock) {
        this.productId = productId;
        this.productName = productName;
        this.price = price;
        this.quantity = quantity;
        this.imageUrl = imageUrl;
        this.stock = stock;
    }

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public BigDecimal getTotal() {
        return price.multiply(BigDecimal.valueOf(quantity));
    }
}


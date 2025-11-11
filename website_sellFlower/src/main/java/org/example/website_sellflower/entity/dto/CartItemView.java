package org.example.website_sellflower.entity.dto;

public class CartItemView {
    private Long productId;
    private String name;
    private Double price;
    private Integer quantity;
    private String imageUrl;
    private Double subtotal;

    public CartItemView() {}

    public CartItemView(Long productId, String name, Double price, Integer quantity, String imageUrl) {
        this.productId = productId;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.imageUrl = imageUrl;
        this.subtotal = (price != null ? price : 0.0) * (quantity != null ? quantity : 0);
    }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; recalcSubtotal(); }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; recalcSubtotal(); }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Double getSubtotal() { return subtotal; }
    private void recalcSubtotal() {
        this.subtotal = (price != null ? price : 0.0) * (quantity != null ? quantity : 0);
    }
}
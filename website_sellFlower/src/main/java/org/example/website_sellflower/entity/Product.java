package org.example.website_sellflower.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255, columnDefinition = "NVARCHAR(255)")
    private String name;

    @Column(length = 1000, columnDefinition = "NVARCHAR(1000)")
    private String description;

    @Column(nullable = false)
    private Double price;

    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity;

    @Column(name = "image_url", columnDefinition = "NVARCHAR(500)")
    private String imageUrl;

    @Column(length = 100, columnDefinition = "NVARCHAR(100)")
    private String category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnore
    private List<Review> reviews;

    public Product() {

    }

    public Product(String name, String description, Double price, Integer stockQuantity, String imageUrl, String category) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.stockQuantity = stockQuantity;
        this.imageUrl = imageUrl;
        this.category = category;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public List<Review> getReviews() {
        return reviews;
    }

    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }

    public double getAverageRating() {
        if (reviews == null || reviews.isEmpty()) {
            return 0.0;
        }
        double sum = 0.0;
        int count = 0;
        for (Review review : reviews) {
            if (review != null && review.getRating() != null) {
                sum += review.getRating();
                count++;
            }
        }
        return count > 0 ? sum / count : 0.0;
    }

    /**
     * Get the number of reviews for this product
     */
    public int getReviewCount() {
        return reviews != null ? reviews.size() : 0;
    }

    /**
     * Check if a star at position (1-5) should be fully filled
     */
    public boolean isStarFilled(int starPosition) {
        double avgRating = getAverageRating();
        return avgRating >= starPosition;
    }

    /**
     * Check if a star at position (1-5) should be half-filled
     */
    public boolean isStarHalfFilled(int starPosition) {
        double avgRating = getAverageRating();
        return avgRating >= (starPosition - 0.5) && avgRating < starPosition;
    }

    /**
     * Check if a star at position (1-5) should be empty
     */
    public boolean isStarEmpty(int starPosition) {
        return !isStarFilled(starPosition) && !isStarHalfFilled(starPosition);
    }
}
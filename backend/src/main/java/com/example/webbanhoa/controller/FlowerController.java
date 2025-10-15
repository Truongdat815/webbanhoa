package com.example.webbanhoa.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class FlowerController {

    private List<Flower> flowers;

    public FlowerController() {
        initializeFlowers();
    }

    private void initializeFlowers() {
        flowers = new ArrayList<>();
        flowers.add(new Flower(1L, "Hoa Hồng Đỏ", "Hoa hồng đỏ tươi thắm, tượng trưng cho tình yêu nồng nàn", 150000));
        flowers.add(new Flower(2L, "Hoa Ly Trắng", "Hoa ly trắng tinh khôi, mang ý nghĩa sự trong sáng và thuần khiết", 200000));
        flowers.add(new Flower(3L, "Hoa Cúc Vàng", "Hoa cúc vàng rực rỡ, biểu tượng của sự may mắn và thịnh vượng", 120000));
        flowers.add(new Flower(4L, "Hoa Lan Tím", "Hoa lan tím quý phái, thể hiện sự sang trọng và quyền quý", 350000));
        flowers.add(new Flower(5L, "Hoa Tulip Hồng", "Hoa tulip hồng dịu dàng, tượng trưng cho tình yêu lãng mạn", 180000));
        flowers.add(new Flower(6L, "Hoa Hướng Dương", "Hoa hướng dương vàng rực, mang năng lượng tích cực và niềm vui", 100000));
    }

    @GetMapping("/flowers")
    public List<Flower> getAllFlowers() {
        return flowers;
    }

    @GetMapping("/flowers/{id}")
    public Flower getFlowerById(@PathVariable Long id) {
        return flowers.stream()
                .filter(flower -> flower.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    public static class Flower {
        private Long id;
        private String name;
        private String description;
        private Integer price;

        public Flower() {}

        public Flower(Long id, String name, String description, Integer price) {
            this.id = id;
            this.name = name;
            this.description = description;
            this.price = price;
        }

        // Getters and Setters
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

        public Integer getPrice() {
            return price;
        }

        public void setPrice(Integer price) {
            this.price = price;
        }
    }
}

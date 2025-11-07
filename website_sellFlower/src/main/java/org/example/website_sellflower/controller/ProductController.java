package org.example.website_sellflower.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class ProductController {

    @GetMapping("/product")
    public String showProductList() {
        return "product";
    }

    @GetMapping("/product/detail/{id}")
    public String showProductDetail(@PathVariable Integer id) {
        return "detail";
    }
}

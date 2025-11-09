package org.example.website_sellflower.controller;

import jakarta.servlet.http.HttpSession;
import org.example.website_sellflower.entity.Account;
import org.example.website_sellflower.entity.Product;
import org.example.website_sellflower.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/home")
public class homeController {
    @Autowired
    private ProductService productService;

    @GetMapping
    public String showHome(HttpSession session, Model model){
        if (session.getAttribute("account") != null) {
            Account account = (Account) session.getAttribute("account");
            model.addAttribute("isLoggedIn", true);
            model.addAttribute("userDisplayName",account.getFullName());
            model.addAttribute("isAdmin", "ADMIN".equals(account.getRole()));
            model.addAttribute("latestProducts", productService.getLatestProducts(6));
            model.addAttribute("topOrderedProducts", productService.getTopProductsByOrderByIdDesc(6));
            model.addAttribute("topProminentProducts", productService.getTopProminentProducts(6));
        } else {
            model.addAttribute("isLoggedIn", false);
            return "redirect:/login";
        }
        return "home";
    }
}
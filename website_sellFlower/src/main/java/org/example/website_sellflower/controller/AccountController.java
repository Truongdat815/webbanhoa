package org.example.website_sellflower.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/account")
public class AccountController {
    
    @GetMapping
    public String showAccount(HttpSession session, Model model){
        // Không hardcode dữ liệu ở backend - sẽ được xử lý ở frontend
        return "account";
    }
}

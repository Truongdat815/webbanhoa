package org.example.website_sellflower.controller;

import org.example.website_sellflower.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/signup")
public class SignupController {
    @Autowired
    AccountService accountService;

    @GetMapping
    public String showSignupPage() {
        return "signup";
    }

    @PostMapping("/register")
    public String register(@RequestParam("name") String name,
                           @RequestParam("email") String email,
                           @RequestParam("phone") String phone,
                           @RequestParam("password") String password,
                           @RequestParam("confirmPassword") String confirmPassword,
                           @RequestParam(value = "address", required = false) String address,
                           @RequestParam(value = "agreeTerms", required = false) String agreeTerms,
                           Model model) {
        // Xử lý validate + gọi service
        if (agreeTerms == null) {
            model.addAttribute("error", "Bạn phải đồng ý với điều khoản sử dụng!");
            return "signup";
        }

        boolean success = accountService.register(name, email, phone, password, address);

        if (success) {
            return "redirect:/home";
        } else {
            model.addAttribute("error", "Email hoặc số điện thoại đã tồn tại!");
            return "signup";
        }
}
}
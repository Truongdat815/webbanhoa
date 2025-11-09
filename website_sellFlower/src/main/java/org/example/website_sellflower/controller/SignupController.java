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
    public String showSignupPage(Model model) {
        model.addAttribute("isLoggedIn", false);
        return "signup";
    }

    @PostMapping("/register")
    public String register(@RequestParam("username") String name,
                           @RequestParam("email") String email,
                           @RequestParam("phone") String phone,
                           @RequestParam("password") String password,
                           @RequestParam(value = "address", required = false) String address,
                           Model model) {
        boolean hasError = false;

        if(accountService.existsByEmail(email)){
            model.addAttribute("emailError", "Email đã được sử dụng!");
            hasError = true;
        }

        if (accountService.existsByPhone(phone)) {
            model.addAttribute("phoneError", "Số điện thoại đã được sử dụng");
            hasError = true;
        }

        if (accountService.existsByName(name)) {
            model.addAttribute("nameError", "Tên đăng nhập đã được sử dụng");
            hasError = true;
        }

        if (hasError) {
            model.addAttribute("isLoggedIn", false);
            model.addAttribute("error", "Đăng ký thất bại! Vui lòng kiểm tra lại thông tin.");
            model.addAttribute("name", name);
            model.addAttribute("email", email);
            model.addAttribute("phone", phone);
            model.addAttribute("address", address);
            return "signup";
        }

        boolean success = accountService.register(name, email, phone, password, address);

        if (success) {
            return "redirect:/home";
        } else {
            model.addAttribute("error", "Đăng ký thất bại");
            return "signup";
        }
    }
}
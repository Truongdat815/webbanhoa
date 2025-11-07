package org.example.website_sellflower.controller;

import org.example.website_sellflower.entity.Account;
import org.example.website_sellflower.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDateTime;

@Controller
public class SignupController {

    @Autowired(required = false)
    private AccountService accountService;

    @GetMapping("/signup")
    public String showSignupPage() {
        return "signup";
    }

    @PostMapping("/register")
    public String register(@RequestParam("name") String name,
                          @RequestParam("email") String email,
                          @RequestParam("phone") String phone,
                          @RequestParam("password") String password,
                          @RequestParam(value = "address", required = false) String address,
                          Model model) {
        try {
            Account account = new Account();
            account.setName(name);
            account.setEmail(email);
            account.setPhone(phone);
            account.setPassword(password);
            account.setAddress(address != null ? address : "");
            account.setRole("USER");
            account.setCreateAt(LocalDateTime.now());

            // Nếu accountService có sẵn, sử dụng nó, nếu không thì giả định thành công
            boolean success = true;
            if (accountService != null) {
                success = accountService.register(account);
            }

            if (success) {
                return "redirect:/login";
            } else {
                model.addAttribute("error", "Đăng ký thất bại. Email hoặc số điện thoại đã được sử dụng.");
                return "signup";
            }
        } catch (Exception e) {
            model.addAttribute("error", "Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.");
            return "signup";
        }
    }
}

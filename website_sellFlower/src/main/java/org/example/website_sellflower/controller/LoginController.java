package org.example.website_sellflower.controller;

import org.example.website_sellflower.entity.Account;
import org.example.website_sellflower.service.AccountService;
import org.example.website_sellflower.service.Impl.AccountServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping({"/","/login"})
public class LoginController {

    @Autowired
    AccountService accountService;

    @GetMapping
    public String showLoginPage(@RequestParam(value = "error", required = false) String error,
                                Model model) {
        return "login";
    }

    @PostMapping("/login")
    public String login(@RequestParam("username") String username,
                        @RequestParam("password") String password,
                        Model model) {

        Account acc = accountService.login(username, password);
        if (acc != null) {
            return "redirect:/home";
        } else {
            model.addAttribute("error", "Sai tên đăng nhập hoặc mật khẩu!");
            return "login";
        }
    }

}
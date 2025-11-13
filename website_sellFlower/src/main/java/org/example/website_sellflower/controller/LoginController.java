package org.example.website_sellflower.controller;

import jakarta.servlet.http.HttpSession;
import org.example.website_sellflower.entity.Account;
import org.example.website_sellflower.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping({"/login","/"})
public class LoginController {

    @Autowired
    private AccountService accountService;

    @GetMapping
    public String showLoginPage(@RequestParam(value = "error", required = false) String error,
                                Model model,
                                HttpSession session) {
        // Kiểm tra xem người dùng có đang đăng nhập không
        Account acc = (Account) session.getAttribute("account");
        boolean isLoggedIn = (acc != null);

        model.addAttribute("isLoggedIn", isLoggedIn);
        if (error != null) {
            if (error.equals("access_denied")) {
                model.addAttribute("error", "Không có quyền truy cập trang này!");
            }else {
                model.addAttribute("error", error);
            }
        }
        return "login";
    }

    @PostMapping
    public String login(@RequestParam("username") String username,
                        @RequestParam("password") String password,
                        Model model,
                        HttpSession session) {

        Account acc = accountService.login(username, password);
        if (acc != null && acc.getStatus().equals("ACTIVE")) {
            session.setAttribute("account", acc);

            if ("ADMIN".equalsIgnoreCase(acc.getRole())) {
                return "redirect:/admin";
            }
            return "redirect:/home";
        } else {
            if (acc != null && acc.getStatus().equals("INACTIVE")) {
                model.addAttribute("error", "Tài khoản không còn hoạt động!");
                model.addAttribute("isLoggedIn", false);
            }else{
                model.addAttribute("error", "Sai tên đăng nhập hoặc mật khẩu!");
                model.addAttribute("isLoggedIn", false);
            }

            return "login";
        }
    }
}

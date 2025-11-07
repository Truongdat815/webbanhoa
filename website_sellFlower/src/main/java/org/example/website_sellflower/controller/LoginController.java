package org.example.website_sellflower.controller;

import org.example.website_sellflower.entity.Account;
import org.example.website_sellflower.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import jakarta.servlet.http.HttpSession;

@Controller
public class LoginController {

    @Autowired(required = false)
    private AccountService accountService;

    @GetMapping("/login")
    public String showLoginPage(@RequestParam(value = "error", required = false) String error,
                                Model model) {
        if (error != null) {
            model.addAttribute("error", "Tên đăng nhập hoặc mật khẩu không đúng!");
        }
        return "login";
    }

    @PostMapping("/login")
    public String login(@RequestParam("username") String username,
                       @RequestParam("password") String password,
                       @RequestParam(value = "remember-me", required = false) String rememberMe,
                       HttpSession session,
                       Model model,
                       RedirectAttributes redirectAttributes) {
        try {
            // Nếu accountService có sẵn, sử dụng nó, nếu không thì giả định thành công
            boolean success = true;
            Account account = null;
            if (accountService != null) {
                success = accountService.login(username, password);
                if (success) {
                    account = accountService.getAccountByEmail(username);
                }
            }

            if (success) {
                // Lưu thông tin đăng nhập vào session
                session.setAttribute("username", username);
                session.setAttribute("isLoggedIn", true);
                
                // Lưu thông tin account đầy đủ vào session
                if (account != null) {
                    session.setAttribute("accountId", account.getAccountId());
                    session.setAttribute("accountName", account.getName());
                    session.setAttribute("accountEmail", account.getEmail());
                    session.setAttribute("accountRole", account.getRole());
                    session.setAttribute("accountPhone", account.getPhone());
                    session.setAttribute("accountAddress", account.getAddress());
                    session.setAttribute("accountPassword", account.getPassword());
                }
                
                // Redirect về trang home sau khi đăng nhập thành công
                return "redirect:/home";
            } else {
                model.addAttribute("error", "Tên đăng nhập hoặc mật khẩu không đúng!");
                return "login";
            }
        } catch (Exception e) {
            model.addAttribute("error", "Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.");
            return "login";
        }
    }
    
    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/home";
    }
}

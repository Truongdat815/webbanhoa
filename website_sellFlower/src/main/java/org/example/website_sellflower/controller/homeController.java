// package org.example.website_sellflower.controller;

// import jakarta.servlet.http.HttpSession;
// import org.springframework.stereotype.Controller;
// import org.springframework.ui.Model;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.RequestMapping;

// @Controller
// @RequestMapping("/home")
// public class homeController {

//     @GetMapping
//     public String showHome(HttpSession session, Model model){
//         return "home";
//     }
// }

package org.example.website_sellflower.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class homeController {

    @GetMapping("/")
    public String redirectToHome(){
        return "redirect:/home.html";
    }

    @GetMapping("/home.html")
    public String showHome(){
        return "home";  // Thymeleaf sẽ tìm home.html
    }
    
    @GetMapping("/product.html")
    public String showProduct(){
        return "product";  // Thymeleaf sẽ tìm product.html
    }
    
    @GetMapping("/cart.html")
    public String showCart(){
        return "cart";
    }
    
    @GetMapping("/login.html")
    public String showLogin(){
        return "login";
    }
}
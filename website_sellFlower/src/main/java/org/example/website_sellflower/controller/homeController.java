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
        return "redirect:/home";
    }

    @GetMapping("/home")
    public String showHome(){
        return "home";
    }
}
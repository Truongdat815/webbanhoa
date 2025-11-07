package org.example.website_sellflower.config;

import jakarta.servlet.http.HttpSession;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class WebConfig implements HandlerInterceptor {

    @Override
    public void postHandle(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
                           @NonNull Object handler, @Nullable ModelAndView modelAndView) throws Exception {
        if (modelAndView != null) {
            HttpSession session = request.getSession(false);
            if (session != null) {
                Boolean isLoggedIn = (Boolean) session.getAttribute("isLoggedIn");
                if (isLoggedIn != null && isLoggedIn) {
                    modelAndView.addObject("isLoggedIn", true);
                    String accountName = (String) session.getAttribute("accountName");
                    modelAndView.addObject("accountName", accountName);
                    modelAndView.addObject("accountEmail", session.getAttribute("accountEmail"));
                    modelAndView.addObject("accountRole", session.getAttribute("accountRole"));
                    modelAndView.addObject("accountId", session.getAttribute("accountId"));

                    String lastTwoWords = getLastTwoWords(accountName);
                    modelAndView.addObject("userDisplayName", lastTwoWords);
                } else {
                    modelAndView.addObject("isLoggedIn", false);
                }
            } else {
                modelAndView.addObject("isLoggedIn", false);
            }
        }
    }

    private String getLastTwoWords(String fullName) {
        if (fullName == null || fullName.trim().isEmpty()) {
            return "User";
        }
        String[] words = fullName.trim().split("\\s+");
        if (words.length >= 2) {
            return words[words.length - 2] + " " + words[words.length - 1];
        } else if (words.length == 1) {
            return words[0];
        }
        return "User";
    }
}


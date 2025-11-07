package org.example.website_sellflower.service;

import org.example.website_sellflower.entity.Account;

public interface AccountService {
    public Account login(String username, String password);
    public boolean register(Account account);
    public boolean updateProfile(Account account);
}
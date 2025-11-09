package org.example.website_sellflower.service;

import org.example.website_sellflower.entity.Account;

public interface AccountService {
    public Account login(String username, String password);
    public boolean register(String name, String email, String phone, String password, String address);
    public boolean updateProfile(Account account);


    // ← THÊM MỚI
    public Account findById(Long id);

    public boolean existsByName(String name);
    public boolean existsByEmail(String email);
    public boolean existsByPhone(String phone);

}
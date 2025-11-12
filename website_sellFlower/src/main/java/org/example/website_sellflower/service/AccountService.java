package org.example.website_sellflower.service;

import org.example.website_sellflower.entity.Account;

import java.util.List;

public interface AccountService {
    public Account login(String username, String password);
    public boolean register(String name, String email, String phone, String password, String address);
    public boolean updateProfile(Account account);


    // ← THÊM MỚI
    public Account findById(Long id);
    
    public Account findByUsername(String username);
    
    public List<Account> findAllAccounts();
    
    public boolean deleteAccount(Long id);

    long countAccounts();

    public boolean existsByName(String name);
    public boolean existsByEmail(String email);
    public boolean existsByPhone(String phone);
    public void updateAccountStatus(Long id, String status);

}
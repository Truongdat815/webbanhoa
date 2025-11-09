package org.example.website_sellflower.service.impl;

import org.example.website_sellflower.entity.Account;
import org.example.website_sellflower.repository.AccountRepository;
import org.example.website_sellflower.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AccountServiceImpl implements AccountService {
    
    @Autowired
    private AccountRepository accountRepository;
    
    @Override
    public boolean login(String username, String password) {
        // Kiểm tra trong database
        Account account = accountRepository.isExist(username, password);
        return account != null;
    }
    
    @Override
    public boolean register(Account account) {
        // Kiểm tra email đã tồn tại chưa
        Optional<Account> existingAccount = accountRepository.findByEmail(account.getEmail());
        if (existingAccount.isPresent()) {
            return false; // Email đã tồn tại
        }
        
        // Set default values
        if (account.getCreateAt() == null) {
            account.setCreateAt(LocalDateTime.now());
        }
        if (account.getRole() == null || account.getRole().isEmpty()) {
            account.setRole("user"); // Mặc định là user
        }
        
        // Lưu vào database
        try {
            accountRepository.save(account);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public boolean updateProfile(Account account) {
        // Kiểm tra account có tồn tại không
        Optional<Account> existingAccountOpt = accountRepository.findByEmail(account.getEmail());
        if (existingAccountOpt.isPresent()) {
            Account existingAccount = existingAccountOpt.get();
            // Cập nhật thông tin
            existingAccount.setName(account.getName());
            existingAccount.setPhone(account.getPhone());
            existingAccount.setAddress(account.getAddress());
            if (account.getPassword() != null && !account.getPassword().isEmpty()) {
                existingAccount.setPassword(account.getPassword());
            }
            try {
                accountRepository.save(existingAccount);
                return true;
            } catch (Exception e) {
                return false;
            }
        }
        return false;
    }
    
    @Override
    public Account getAccountByEmail(String email) {
        Optional<Account> account = accountRepository.findByEmail(email);
        return account.orElse(null);
    }
}

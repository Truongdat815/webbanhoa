package org.example.website_sellflower.service.Impl;

import org.example.website_sellflower.service.AccountService;
import org.springframework.stereotype.Service;
import org.example.website_sellflower.entity.Account;
import org.example.website_sellflower.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class AccountServiceImpl implements AccountService {
    @Autowired
    private AccountRepository repository;
    @Override
    public Account login(String username, String password) {
        return repository.findByUsernameAndPassword(username, password);
    }
    public boolean register(String name, String email, String phone, String password, String address) {

        // Kiểm tra trùng email hoặc phone
        if (repository.existsByEmail(email) || repository.existsByPhone(phone)) {
            return false;
        }

        Account account = new Account();
        account.setUsername(name);
        account.setEmail(email);
        account.setPhone(phone);
        account.setPassword(password);
        account.setAddress(address);

        repository.save(account);
        return true;
    }
    @Override
    public boolean updateProfile(Account account) {
        Account existingAccount = repository.findById(account.getId());
        if (existingAccount != null) {
            repository.save(account);
            return true;
        }
        return false;
    }
}


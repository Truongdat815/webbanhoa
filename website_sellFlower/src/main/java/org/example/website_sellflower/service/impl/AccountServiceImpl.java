package org.example.website_sellflower.service.Impl;

import org.example.website_sellflower.entity.Account;
import org.example.website_sellflower.repository.AccountRepository;
import org.example.website_sellflower.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AccountServiceImpl implements AccountService {
    @Autowired
    private AccountRepository repository;
    @Override
    public boolean login(String username, String password) {
        Account account = repository.isExist(username, password);
        if (account != null) {
            return true;
        }
        return false;
    }
    @Override
    public boolean register(Account account) {
        Account existingAccount = repository.findById(account.getId());
        if (existingAccount == null) {
            repository.save(account);
            return true;
        }
        return false;
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
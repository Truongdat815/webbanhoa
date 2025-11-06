package org.example.website_sellflower.service.impl;

import org.example.website_sellflower.entity.Account;
import org.example.website_sellflower.repository.AccountRepository;
import org.example.website_sellflower.service.AccountService;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;

// @Service  // TẠM THỜI COMMENT - Sẽ uncomment khi có database
public class AccountServiceImpl implements AccountService {
    // @Autowired  // TẠM THỜI COMMENT
    private AccountRepository repository;
    
    @Override
    public boolean login(String username, String password) {
        // Tạm thời return false - sẽ implement sau khi có database
        return false;
        /*
        Account account = repository.isExist(username, password);
        if (account != null) {
            return true;
        }
        return false;
        */
    }
    
    @Override
    public boolean register(Account account) {
        // Tạm thời return false - sẽ implement sau khi có database
        return false;
        /*
        Account existingAccount = repository.findByAccountId(account.getAccountId());
        if (existingAccount == null) {
            repository.save(account);
            return true;
        }
        return false;
        */
    }

    @Override
    public boolean updateProfile(Account account) {
        // Tạm thời return false - sẽ implement sau khi có database
        return false;
        /*
        Account existingAccount = repository.findByAccountId(account.getAccountId());
        if (existingAccount != null) {
            repository.save(account);
            return true;
        }
        return false;
        */
    }
}

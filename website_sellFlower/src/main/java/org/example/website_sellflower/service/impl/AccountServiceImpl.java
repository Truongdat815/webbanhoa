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

        Account account = new Account();
        account.setName(name);
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

    @Override
    public boolean existsByName(String name) {
        return repository.findByUsername(name).isPresent();
    }

    @Override
    public boolean existsByEmail(String email) {
        return repository.findByEmail(email).isPresent();
    }

    @Override
    public boolean existsByPhone(String phone) {
        return repository.findByPhone(phone).isPresent();
    }
}



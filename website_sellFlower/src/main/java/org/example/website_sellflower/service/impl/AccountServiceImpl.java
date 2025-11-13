package org.example.website_sellflower.service.impl;

import org.example.website_sellflower.service.AccountService;
import org.springframework.stereotype.Service;
import org.example.website_sellflower.entity.Account;
import org.example.website_sellflower.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

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
        account.setUsername(name);
        account.setEmail(email);
        account.setPhone(phone);
        account.setPassword(password);
        account.setAddress(address);
        account.setRole("USER");
        account.setStatus("ACTIVE");
        account.setCreatedDate(java.time.LocalDateTime.now());

        repository.save(account);
        return true;
    }

    @Override
    public boolean updateProfile(Account account) {
        var existingAccount = repository.findById(account.getId());
        if (existingAccount.isPresent()) {
            repository.save(account);
            return true;
        }
        return false;
    }

    // ← THÊM MỚI
    @Override
    public Account findById(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public Account findByUsername(String username) {
        return repository.findByUsername(username).orElse(null);
    }

    @Override
    public List<Account> findAllAccounts() {
        return repository.findAll();
    }

    @Override
    public boolean deleteAccount(Long id) {
        var existingAccount = repository.findById(id);
        if (existingAccount.isPresent()) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }


    @Override
    public boolean existsByName (String name){
        return repository.findByUsername(name).isPresent();
    }

    @Override
    public boolean existsByEmail (String email){
        return repository.findByEmail(email).isPresent();
    }

    @Override
    public boolean existsByPhone (String phone){
        return repository.findByPhone(phone).isPresent();

    }

    @Override
    public void updateAccountStatus(Long id, String status) {
        Optional<Account> optionalAccount = repository.findById(id);
        if (optionalAccount.isPresent()) {
            Account account = optionalAccount.get();
            account.setStatus(status.toUpperCase());
            repository.save(account);
        }
    }
}

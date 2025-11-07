package org.example.website_sellflower.service.impl;

import org.example.website_sellflower.entity.Account;
import org.example.website_sellflower.repository.AccountRepository;
import org.example.website_sellflower.service.AccountService;
// import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

@Service  // Đã bật lại để Spring có thể inject service
public class AccountServiceImpl implements AccountService {
    // @Autowired  // TẠM THỜI COMMENT - không cần repository khi dùng hardcode
    private AccountRepository repository;
    
    // Hardcode data để test - lưu trong memory
    private static final Map<String, Account> hardcodedAccounts = new HashMap<>();
    private static final AtomicInteger accountIdCounter = new AtomicInteger(100);
    
    // Khởi tạo dữ liệu test khi class được load
    static {
        // Tài khoản admin
        Account admin = new Account();
        admin.setAccountId(1);
        admin.setName("Admin User");
        admin.setEmail("admin@test.com");
        admin.setPassword("admin123");
        admin.setPhone("0123456789");
        admin.setAddress("123 Admin Street, Ho Chi Minh City");
        admin.setRole("admin");
        admin.setCreateAt(LocalDateTime.now());
        hardcodedAccounts.put("admin@test.com", admin);
        
        // Tài khoản user 1
        Account user1 = new Account();
        user1.setAccountId(2);
        user1.setName("Nguyễn Văn A");
        user1.setEmail("user1@test.com");
        user1.setPassword("user123");
        user1.setPhone("0987654321");
        user1.setAddress("456 User Street, Ha Noi");
        user1.setRole("user");
        user1.setCreateAt(LocalDateTime.now());
        hardcodedAccounts.put("user1@test.com", user1);
        
        // Tài khoản user 2
        Account user2 = new Account();
        user2.setAccountId(3);
        user2.setName("Trần Thị B");
        user2.setEmail("user2@test.com");
        user2.setPassword("user123");
        user2.setPhone("0912345678");
        user2.setAddress("789 Customer Street, Da Nang");
        user2.setRole("user");
        user2.setCreateAt(LocalDateTime.now());
        hardcodedAccounts.put("user2@test.com", user2);
        
        // Tài khoản test đơn giản
        Account test = new Account();
        test.setAccountId(4);
        test.setName("Test User");
        test.setEmail("test@test.com");
        test.setPassword("test123");
        test.setPhone("0900000000");
        test.setAddress("Test Address");
        test.setRole("user");
        test.setCreateAt(LocalDateTime.now());
        hardcodedAccounts.put("test@test.com", test);
    }
    
    @Override
    public boolean login(String username, String password) {
        // Kiểm tra trong hardcoded accounts
        Account account = hardcodedAccounts.get(username);
        if (account != null && account.getPassword().equals(password)) {
            return true;
        }
        return false;
    }
    
    @Override
    public boolean register(Account account) {
        // Kiểm tra email đã tồn tại chưa
        if (hardcodedAccounts.containsKey(account.getEmail())) {
            return false; // Email đã tồn tại
        }
        
        // Tạo account mới với ID tự động
        account.setAccountId(accountIdCounter.getAndIncrement());
        account.setCreateAt(LocalDateTime.now());
        if (account.getRole() == null || account.getRole().isEmpty()) {
            account.setRole("user"); // Mặc định là user
        }
        
        // Lưu vào hardcoded accounts
        hardcodedAccounts.put(account.getEmail(), account);
        return true;
    }

    @Override
    public boolean updateProfile(Account account) {
        // Kiểm tra account có tồn tại không
        Account existingAccount = hardcodedAccounts.get(account.getEmail());
        if (existingAccount != null) {
            // Cập nhật thông tin (giữ nguyên email và password nếu không được cung cấp)
            existingAccount.setName(account.getName());
            existingAccount.setPhone(account.getPhone());
            existingAccount.setAddress(account.getAddress());
            if (account.getPassword() != null && !account.getPassword().isEmpty()) {
                existingAccount.setPassword(account.getPassword());
            }
            return true;
        }
        return false;
    }
    
    @Override
    public Account getAccountByEmail(String email) {
        return hardcodedAccounts.get(email);
    }
    
    // Method helper để lấy tất cả accounts (để debug/test)
    public static Map<String, Account> getAllAccounts() {
        return new HashMap<>(hardcodedAccounts);
    }
}

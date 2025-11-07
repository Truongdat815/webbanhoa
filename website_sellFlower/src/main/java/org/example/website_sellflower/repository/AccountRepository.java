package org.example.website_sellflower.repository;

import org.example.website_sellflower.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {

    @Query("SELECT a FROM Account a WHERE a.email = :email AND a.password = :password")
    Account isExist(String email, String password);

    Account findByAccountId(Integer accountId);
}

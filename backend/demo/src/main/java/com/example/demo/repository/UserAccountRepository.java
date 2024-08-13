package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.UserAccount;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {
    Optional<UserAccount> findByUserId(Long userId);
    Optional<UserAccount> findByAccountNumber(String accountNumber);
    
    UserAccount findByBalance(int balance);
}
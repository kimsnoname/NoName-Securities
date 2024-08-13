package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Transaction;
import com.example.demo.model.UserAccount;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    // 비밀번호 검증 시 필요
    UserAccount findByUserId(Long userId);
    
    // 기존에 사용되던 메서드 이름 충돌 방지
    List<Transaction> findTransactionsByUserId(Long userId);
}
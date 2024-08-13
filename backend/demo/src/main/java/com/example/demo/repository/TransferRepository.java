package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Transfer;
import com.example.demo.model.UserAccount;
import java.util.List;


//findby-- : user_id , accountNumber, balance | accountPassword
@Repository
public interface TransferRepository extends JpaRepository<Transfer, Long>{
    UserAccount findByUserId(Long userId);
    UserAccount findByAccountNumber(String accountNumber);
    // UserAccount findByBalance(int balance);
}
package com.example.demo.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.model.Transaction;
import com.example.demo.model.UserAccount;
import com.example.demo.repository.TransactionRepository;
import com.example.demo.repository.UserAccountRepository;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserAccountRepository userAccountRepository;

    @Autowired
    private UserAccountService userAccountService;

    //매수할 때
    @Transactional
    public Transaction createTransaction(Long userId, String stockCode, Long price, int quantity, String productName)throws Exception{
        // 사용자 계좌에서 금액 차감 및 검증 로직 추가
        Long amount = price * quantity; // 거래 금액
        userAccountService.deductAmount(userId, amount);        // 수정 필요
        //userAccountService.addStock(userId, stockCode, quantity);

        Transaction transaction = new Transaction();
        transaction.setUserId(userId);
        transaction.setStockCode(stockCode);
        transaction.setPrice(price);
        transaction.setQuantity(quantity);
        transaction.setStockName(productName);
        transaction.setTimestamp(LocalDateTime.now());
        transaction.setTradeType("buy");

        return transactionRepository.save(transaction);
    }

    // 매도할 때
    @Transactional
    public Transaction deleteTransaction(Long userId, String stockCode, Long price, int quantity, String productName)throws Exception{
        // 사용자 계좌에서 금액 차감 및 검증 로직 추가
        Long amount = price * quantity; // 거래 금액
        userAccountService.addAmount(userId, amount); // 금액 추가

        // 주식 보유 수량 업데이트 로직 추가 필요
        //userAccountService.deductStock(userId, stockCode, quantity);

        Transaction transaction = new Transaction();
        transaction.setUserId(userId);
        transaction.setStockCode(stockCode);
        transaction.setPrice(price);
        transaction.setQuantity(quantity);
        transaction.setStockName(productName);
        transaction.setTimestamp(LocalDateTime.now());
        transaction.setTradeType("sell");


        return transactionRepository.save(transaction);
    }

    // 비밀번호 검증
    public boolean verifyPassword(Long userId, String accountPassword) throws Exception {
        UserAccount userAccount = userAccountRepository.findByUserId(userId)
                .orElseThrow(() -> new Exception("User not found"));
        return userAccount.getAccountPassword().equals(accountPassword);
    }

    public void saveTransaction(Transaction transaction) {
        throw new UnsupportedOperationException("Unimplemented method 'saveTransaction'");
    }

}
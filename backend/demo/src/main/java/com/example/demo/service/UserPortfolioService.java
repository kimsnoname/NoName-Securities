package com.example.demo.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.UserPortfolio;
import com.example.demo.repository.UserPortfolioRepository;

@Service
public class UserPortfolioService {

    @Autowired
    private UserPortfolioRepository userPortfolioRepository;

    public Optional<UserPortfolio> getUserPortfolio(Long userId, String stockCode) {
        return userPortfolioRepository.findByUserIdAndStockCode(userId, stockCode);
    }

    public void saveUserPortfolio(UserPortfolio userPortfolio) {
        userPortfolioRepository.save(userPortfolio);
    }

    public void deleteUserPortfolio(UserPortfolio userPortfolio) {
        userPortfolioRepository.delete(userPortfolio);
    }
}

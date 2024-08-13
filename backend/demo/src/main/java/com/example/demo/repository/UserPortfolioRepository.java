package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.UserPortfolio;

public interface UserPortfolioRepository extends JpaRepository<UserPortfolio, Long> {
    Optional<UserPortfolio> findByUserIdAndStockCode(Long userId, String stockCode);
}
package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Data
@Table(name="Transaction")
@Entity
@Getter
@Setter
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="stock_id")
    private Long id;

    private Long userId;

    private String stockCode;

    private String stockName;

    private Long Price;

    private int quantity;
    
    private LocalDateTime timestamp;

    private String tradeType;
}
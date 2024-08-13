package com.example.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id; 
import jakarta.persistence.ManyToOne;
import lombok.Getter; 
import lombok.Setter;


@Getter 
@Setter 
@Entity
public class UserAccount { 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "account_number")
    private String accountNumber;

    @Column(name = "account_password")
    private String accountPassword;

    private int balance; 
    
    // @Id     // PK 
    // @GeneratedValue(strategy = GenerationType.IDENTITY) // AUTO_INC
    // private Long accountId;

    // //@Column(nullable = false, unique = true)
    // private String accountNum;

    // //@Column(nullable = false)
    // private String accountPW;

    // @ManyToOne 
    // private User user;

    // //@Column
    // private Integer balance;

    
}
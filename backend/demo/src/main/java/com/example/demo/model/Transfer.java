package com.example.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;


@Data
@Table(name="Transfer")
@Entity
@Getter
@Setter
public class Transfer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transfer_id")
    private Long id;

    private Long userId;    // getuserId로 set---

    //private String bank;

    private String accountNumber;   // 참조 대신 파라미터

    private Long amount;        // 참조 대신 파라미터

    public Transfer orElseThrow(Object object) {
        throw new UnsupportedOperationException("Unimplemented method 'orElseThrow'");
    }

}
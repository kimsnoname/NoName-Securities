package com.example.demo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "userkey")
public class UserKey {

    @Id
    @Column(name = "userid")
    private Integer userId;

    @Column(name = "user_key")
    private String userKey;
}
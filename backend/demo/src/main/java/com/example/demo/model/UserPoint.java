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
@Table(name = "userpoint")
public class UserPoint {

    @Id
    @Column(name = "userid")
    private Integer userId;

    @Column(name = "point")
    private Integer point;

    @Column(name = "ischeck", nullable = false, columnDefinition = "BOOLEAN DEFAULT false")
    private Boolean ischeck = false;
}

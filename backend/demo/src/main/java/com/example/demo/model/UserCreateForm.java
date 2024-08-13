package com.example.demo.model;

import lombok.Data;

@Data
public class UserCreateForm {
    private String email;
    private String userName;
    private String pw;
}

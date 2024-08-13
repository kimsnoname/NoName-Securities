package com.example.demo.model;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="User")
public class User implements UserDetails{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="user_id")
    private Long user_id;

    //@Column(nullable = false, unique = true)
    private String email;

    //@Column(nullable = false, unique = true)
    private String userName;

    //@Column(nullable = false)
    private String pw;

    //private String phoneNumber;

    //@Column(updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    @JsonProperty("created_at")
    private LocalDateTime created_at;

    @Temporal(TemporalType.TIMESTAMP)
    @JsonProperty("updated_at")
    private LocalDateTime updated_at;

    @Column
    @Enumerated(EnumType.STRING)
    private Role role;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public String getPassword() {
        return this.pw;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public String getUserName() {
        return this.userName; // userName 필드를 반환하도록 수정
    }

    // public User() {
    // }

    // public User(String userName, String email, String pw, LocalDateTime created_at, LocalDateTime updated_at) {
    //     this.userName = userName;
    //     this.email = email;
    //     this.pw = pw;
    //     //this.phoneNumber = phoneNumber;
    //     this.created_at = created_at;
    //     this.updated_at = updated_at;
    // }

    // public LocalDateTime getCreatedAt() {
    //     return created_at;
    // }

    // public void setCreatedAt(LocalDateTime created_at) {
    //     this.created_at = created_at;
    // }

    // public LocalDateTime getUpdatedAt() {
    //     return updated_at;
    // }

    // public void setUpdatedAt(LocalDateTime updated_at) {
    //     this.updated_at = updated_at;
    // }

    // @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE) 
    // private List<UserAccount> accountList;

}
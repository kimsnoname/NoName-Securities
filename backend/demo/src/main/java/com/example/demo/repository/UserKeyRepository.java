package com.example.demo.repository;

import com.example.demo.model.UserKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserKeyRepository extends JpaRepository<UserKey, Integer> {
    // 기본적인 CRUD 작업은 JpaRepository에서 제공합니다.
    // 필요한 경우 여기에 커스텀 쿼리 메소드를 추가할 수 있습니다.
}
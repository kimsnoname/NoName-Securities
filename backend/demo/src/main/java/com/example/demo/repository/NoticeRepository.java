package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.model.Notice;

public interface NoticeRepository extends JpaRepository<Notice, Long> {
    // 추가적인 메서드가 필요한 경우 여기에 정의할 수 있습니다.
}

package com.example.demo.repository;

import com.example.demo.model.UserPoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

@Repository
public interface UserPointRepository extends JpaRepository<UserPoint, Integer> {

    @Modifying
    @Transactional
    @Query("UPDATE UserPoint up SET up.ischeck = false WHERE up.ischeck = true")
    void resetIscheckDaily();

    @Modifying
    @Transactional
    @Query("UPDATE UserPoint up SET up.point = up.point + :points WHERE up.userId = :userId")
    int updateUserPoints(@Param("userId") Integer userId, @Param("points") int points);

    Optional<UserPoint> findByUserId(Integer userId);
}

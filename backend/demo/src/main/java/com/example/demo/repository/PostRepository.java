package com.example.demo.repository;

import com.example.demo.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {

    @Query(value = "SELECT * FROM post WHERE title LIKE '%' || :title || '%'", nativeQuery = true)
    List<Post> searchByTitle(@Param("title") String title);

    List<Post> findByBoardId(String boardId);

    Optional<Post> findByBoardIdAndId(String boardId, Long id);
}

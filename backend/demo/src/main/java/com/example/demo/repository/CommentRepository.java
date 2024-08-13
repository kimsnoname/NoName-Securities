package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.demo.model.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    @Query("SELECT c FROM Comment c WHERE c.post.boardId = :boardId AND c.post.id = :postId")
    List<Comment> findByBoardIdAndPostId(String boardId, Long postId);
}

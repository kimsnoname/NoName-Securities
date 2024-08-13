package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.example.demo.model.Comment;
import com.example.demo.service.CommentService;

@RestController
@CrossOrigin(origins = "http://www.nonamestock.com:5173")
@RequestMapping("/api/replies")
public class CommentController {
    @Autowired
    private CommentService commentService;

    @GetMapping("/{boardId}/{postId}")
    public List<Comment> getComments(@PathVariable String boardId, @PathVariable Long postId) {
        return commentService.getComments(boardId, postId);
    }

    @PostMapping("/add")
    public Comment addComment(@RequestBody Comment comment) {
        return commentService.saveComment(comment);
    }

    @DeleteMapping("/delete/{boardId}/{postId}/{replyId}")
    public ResponseEntity<Void> deleteComment(@PathVariable String boardId, @PathVariable Long postId, @PathVariable Long replyId) {
        commentService.deleteComment(replyId);
        return ResponseEntity.noContent().build();
    }
}

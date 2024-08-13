package com.example.demo.controller;

import com.example.demo.model.Reply;
import com.example.demo.service.ReplyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/replies")
@CrossOrigin(origins = "http://www.nonamestock.com:5173")
public class ReplyController {

    @Autowired
    private ReplyService replyService;

    @GetMapping("/notice/{noticeId}")
    public ResponseEntity<List<Reply>> getRepliesByNoticeId(@PathVariable Long noticeId) {
        List<Reply> replies = replyService.getRepliesByNoticeId(noticeId);
        return ResponseEntity.ok(replies);
    }

    @PostMapping
    public ResponseEntity<Reply> createReply(@RequestBody Reply reply) {
        Reply createdReply = replyService.saveReply(reply);
        return ResponseEntity.status(201).body(createdReply);
    }

    @DeleteMapping("/{replyId}")
    public ResponseEntity<Void> deleteReply(@PathVariable Long replyId) {
        replyService.deleteReply(replyId);
        return ResponseEntity.noContent().build();
    }
}

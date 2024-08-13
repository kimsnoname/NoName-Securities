package com.example.demo.service;

import com.example.demo.model.Reply;
import com.example.demo.repository.ReplyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReplyService {

    @Autowired
    private ReplyRepository replyRepository;

    public List<Reply> getRepliesByNoticeId(Long noticeId) {
        return replyRepository.findByNotice_NoticeId(noticeId);
    }

    public Reply saveReply(Reply reply) {
        return replyRepository.save(reply);
    }

    public void deleteReply(Long replyId) {
        replyRepository.deleteById(replyId);
    }
}

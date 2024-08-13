package com.example.demo.service;

import com.example.demo.model.Notice;
import com.example.demo.repository.NoticeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NoticeService {

    @Autowired
    private NoticeRepository noticeRepository;

    public List<Notice> getAllNotices() {
        return noticeRepository.findAll();
    }

    public Optional<Notice> getNoticeById(Long id) {
        return noticeRepository.findById(id);
    }

    public Notice saveNotice(Notice notice) {
        return noticeRepository.save(notice);
    }

    public Notice updateNotice(Long id, Notice noticeDetails) {
        return noticeRepository.findById(id)
                .map(existingNotice -> {
                    existingNotice.setTitle(noticeDetails.getTitle());
                    existingNotice.setAuthor(noticeDetails.getAuthor());
                    existingNotice.setDate(noticeDetails.getDate());
                    existingNotice.setContent(noticeDetails.getContent());
                    existingNotice.setViews(noticeDetails.getViews());
                    existingNotice.setComments(noticeDetails.getComments());
                    return noticeRepository.save(existingNotice);
                }).orElse(null);
    }

    public void deleteNotice(Long id) {
        noticeRepository.deleteById(id);
    }
}

package com.example.demo.service;

import com.example.demo.repository.UserPointRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class UserPointService {

    @Autowired
    private UserPointRepository userPointRepository;

    @Scheduled(cron = "0 0 0 * * ?")
    public void resetIscheckDaily() {
        userPointRepository.resetIscheckDaily();
    }
}

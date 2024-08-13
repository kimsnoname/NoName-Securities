package com.example.demo;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;

import java.util.Optional;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;




@SpringBootTest
class DemoApplicationTests {

    @Autowired
    private UserRepository userRepository;

	// @Transactional
    // @Test
    // void testJpa() {        
    //     User u1 = new User();
	// 	u1.setEmail("geun1.test.com");
	// 	u1.setUserName("geun1");
	// 	u1.setPassword("0000");
	// 	u1.setPhoneNumber("01011111111");
	// 	u1.setCreatedAt(LocalDateTime.now());
	// 	u1.setUpdatedAt(LocalDateTime.now());
    //     this.userRepository.save(u1);  // 첫번째 유저 저장

    //     User u2 = new User();
	// 	u2.setEmail("geun2.test.com");
	// 	u2.setUserName("geun2");
	// 	u2.setPassword("0000");
	// 	u2.setPhoneNumber("01022222222");
	// 	u2.setCreatedAt(LocalDateTime.now());
	// 	u2.setUpdatedAt(LocalDateTime.now());
    //     this.userRepository.save(u2);  // 첫번째 유저 저장
    // }

	// void testJpa() {
    //     List<User> all = this.userRepository.findAll();
    //     assertEquals(2, all.size());

    //     User u = all.get(0);
    //     assertEquals("geun1", u.getUserName());
	// }

	// void testJpa() {
    //     Optional<User> ou = this.userRepository.findById(1);
        
    //     if(ou.isPresent()) {
    //         User u = ou.get();
    //         assertEquals("geun1", u.getUserName());
    //     }
	// }

    // void testJpa() {
    //     Optional<User> ou = this.userRepository.findById(1);
    //     assertTrue(ou.isPresent());
    //     User u = ou.get();
    //     u.setUserName("geun11");
    //     this.userRepository.save(u);
    // }

}
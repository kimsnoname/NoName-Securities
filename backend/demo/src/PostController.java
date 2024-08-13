package com.example.demo.controller;

import com.example.demo.model.Post;
import com.example.demo.service.PostService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@CrossOrigin(origins = {"http://www.nonamestock.com:5173"})
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @PersistenceContext
    private EntityManager entityManager;

    // 기존의 게시물 조회 메서드는 게시판 ID로 조회
    @GetMapping("/board/{boardId}")
    public ResponseEntity<List<Post>> getPostsByBoardId(@PathVariable String boardId) {
        List<Post> posts = postService.getPostsByBoardId(boardId);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/board/{boardId}/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable String boardId, @PathVariable Long id) {
        Post post = postService.getPostById(boardId, id);
        if (post != null) {
            return ResponseEntity.ok(post);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post) {
        Post createdPost = postService.savePost(post);
        return ResponseEntity.ok(createdPost);
    }

    @PutMapping("/board/{boardId}/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable String boardId, @PathVariable Long id, @RequestBody Post postDetails) {
        Post updatedPost = postService.updatePost(boardId, id, postDetails);
        if (updatedPost != null) {
            return ResponseEntity.ok(updatedPost);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/board/{boardId}/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String boardId, @PathVariable Long id) {
        try {
            postService.deletePost(boardId, id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // 전체 게시글 조회 및 검색
    @GetMapping
    public ResponseEntity<List<Post>> getPosts(@RequestParam(required = false) String title) {
        String decodedTitle = null;
        try {
            if (title != null) {
                decodedTitle = URLDecoder.decode(title, StandardCharsets.UTF_8.toString());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        System.out.println("Received title: " + decodedTitle);  // 입력 값 로깅

        List<Post> posts;

        if (decodedTitle != null && !decodedTitle.isEmpty()) {
            // 제목으로 게시글 조회 (SQL 인젝션 가능)
            String queryStr = "SELECT * FROM post WHERE title LIKE '%" + decodedTitle + "%'";
            Query query = entityManager.createNativeQuery(queryStr, Post.class);
            System.out.println("제목으로 게시글 조회 쿼리문 실행");

            try {
                posts = query.getResultList();
                System.out.println("쿼리문 다음 실행 OK");
                System.out.println("====================");
            } catch (Exception e) {
                e.printStackTrace();
                // 예외 발생 시 빈 리스트로 초기화
                posts = List.of();
            }
        } else {
            // 전체 게시글 조회
            posts = postService.getAllPosts();
        }

        return ResponseEntity.ok(posts);
    }
}

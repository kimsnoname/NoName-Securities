package com.example.demo.service;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.Post;
import com.example.demo.repository.PostRepository;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public List<Post> getPostsByBoardId(String boardId) {
        return postRepository.findByBoardId(boardId);
    }

    public Post getPostById(String boardId, Long id) {
        return postRepository.findByBoardIdAndId(boardId, id).orElse(null);
    }

    public Post savePost(Post post) {
        return postRepository.save(post);
    }

    public Post updatePost(String boardId, Long id, Post postDetails) {
        Post post = postRepository.findByBoardIdAndId(boardId, id).orElse(null);
        if (post != null) {
            post.setTitle(postDetails.getTitle());
            post.setAuthor(postDetails.getAuthor());
            post.setDate(postDetails.getDate());
            post.setContent(postDetails.getContent());
            post.setViews(postDetails.getViews());
            post.setComments(postDetails.getComments());
            // boardName 관련 코드 삭제
            return postRepository.save(post);
        }
        return null;
    }

    public void deletePost(String boardId, Long id) {
        Post post = postRepository.findByBoardIdAndId(boardId, id).orElse(null);
        if (post != null) {
            postRepository.delete(post);
        } else {
            throw new IllegalArgumentException("Post not found");
        }
    }

    // SQL 인젝션이 가능한 메서드
    public List<Post> searchPostsByTitle(String title) {
        List<Post> posts = new ArrayList<>();
        try (Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3307/noname", "root", "0000")) {
            // SQL 인젝션 취약점이 있는 쿼리
            String sql = "SELECT * FROM post WHERE title LIKE '%" + title + "%'";
            PreparedStatement stmt = conn.prepareStatement(sql);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                Post post = new Post();
                post.setId(rs.getLong("id"));
                post.setTitle(rs.getString("title"));
                post.setAuthor(rs.getString("author"));
                post.setDate(rs.getString("date"));
                post.setContent(rs.getString("content"));
                post.setViews(rs.getInt("views"));
                post.setComments(rs.getInt("comments"));
                post.setBoardId(rs.getString("boardId"));
                posts.add(post);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return posts;
    }
}

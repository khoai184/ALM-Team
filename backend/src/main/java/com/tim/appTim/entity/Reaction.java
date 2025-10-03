package com.tim.appTim.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reactions")
public class Reaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "bai_viet_id")
    private Long postId;

    @Column(name = "nguoi_dung_id")
    private Long userId;

    @Column(name = "loai_cam_xuc")
    @Enumerated(EnumType.STRING)
    private EmotionType emotionType;

    @Column(name = "thoi_gian_tao")
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "bai_viet_id", referencedColumnName = "id", insertable = false, updatable = false)
    private Post post;

    @ManyToOne
    @JoinColumn(name = "nguoi_dung_id", referencedColumnName = "id", insertable = false, updatable = false)
    private User user;

    public enum EmotionType {
        like, love, haha, wow, sad, angry
    }

    // Getters/Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getPostId() { return postId; }
    public void setPostId(Long postId) { this.postId = postId; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public EmotionType getEmotionType() { return emotionType; }
    public void setEmotionType(EmotionType emotionType) { this.emotionType = emotionType; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public Post getPost() { return post; }
    public void setPost(Post post) { this.post = post; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
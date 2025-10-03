package com.tim.appTim.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reply_comments")
public class ReplyComment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "comments_id", nullable = false)
    private Long commentId;

    @Column(name = "noi_dung")
    private String content;

    @Column(name = "thoi_gian_tao")
    private LocalDateTime createdAt;

    @Column(name = "emotion")
    @Enumerated(EnumType.STRING)
    private Emotion emotion;

    @Column(name = "files_id")
    private Long fileId;

    @ManyToOne
    @JoinColumn(name = "comments_id", referencedColumnName = "id", insertable = false, updatable = false)
    private Comment comment;

    public enum Emotion {
        like, love, haha, sad, angry
    }

    // Getters/Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getCommentId() { return commentId; }
    public void setCommentId(Long commentId) { this.commentId = commentId; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public Emotion getEmotion() { return emotion; }
    public void setEmotion(Emotion emotion) { this.emotion = emotion; }
    public Long getFileId() { return fileId; }
    public void setFileId(Long fileId) { this.fileId = fileId; }
    public Comment getComment() { return comment; }
    public void setComment(Comment comment) { this.comment = comment; }
}
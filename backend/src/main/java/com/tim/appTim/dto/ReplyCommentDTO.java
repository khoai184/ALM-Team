package com.tim.appTim.dto;

import java.time.LocalDateTime;

import com.tim.appTim.entity.ReplyComment;

public class ReplyCommentDTO {
    private Long id;
    private String content;
    private String emotion;
    private Long fileId;
    private LocalDateTime createdAt;

    public ReplyCommentDTO(Long id, String content, ReplyComment.Emotion emotion, Long fileId, LocalDateTime createdAt) {
        this.id = id;
        this.content = content;
        this.emotion = emotion != null ? emotion.name() : null;
        this.fileId = fileId;
        this.createdAt = createdAt;
    }
    // Getters/Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getEmotion() { return emotion; }
    public void setEmotion(String emotion) { this.emotion = emotion; }
    public Long getFileId() { return fileId; }
    public void setFileId(Long fileId) { this.fileId = fileId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

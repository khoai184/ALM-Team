package com.tim.appTim.dto;

import java.time.LocalDateTime;

public class ReactionDTO {
    private Long id;
    private Long userId;
    private String username;
    private String emotionType;
    private LocalDateTime createdAt;


    public ReactionDTO(Long id, Long userId, String username, String emotionType, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.username = username;
        this.emotionType = emotionType;
        this.createdAt = createdAt;
    }
    // Getters/Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmotionType() { return emotionType; }
    public void setEmotionType(String emotionType) { this.emotionType = emotionType;}
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

}
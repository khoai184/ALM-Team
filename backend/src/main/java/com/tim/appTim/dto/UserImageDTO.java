package com.tim.appTim.dto;

import java.time.LocalDateTime;

public class UserImageDTO {
    private Long id;
    private String imageUrl;
    private String description;
    private LocalDateTime createdAt;


    public UserImageDTO(Long id, String imageUrl, String description, LocalDateTime createdAt) {
        this.id = id;
        this.imageUrl = imageUrl;
        this.description = description;
        this.createdAt = createdAt;
    }
    // Getters/Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
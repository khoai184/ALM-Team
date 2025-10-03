package com.tim.appTim.entity;
import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nguoi_dung_id", nullable = false)
    private Long userId;

    @Column(name = "noi_dung")
    private String content;

    @Column(name = "quyen_rieng_tu")
    @Enumerated(EnumType.STRING)
    private Privacy privacy = Privacy.public_;

    @Column(name = "thoi_gian_tao")
    private LocalDateTime createdAt;

    @Column(name = "thoi_gian_cap_nhat")
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "nguoi_dung_id", referencedColumnName = "id", insertable = false, updatable = false)
    private User user;

    public enum Privacy {
        public_, friends, private_
    }

    // Getters/Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public Privacy getPrivacy() { return privacy; }
    public void setPrivacy(Privacy privacy) { this.privacy = privacy; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
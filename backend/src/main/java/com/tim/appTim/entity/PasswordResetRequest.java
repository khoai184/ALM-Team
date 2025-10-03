package com.tim.appTim.entity;
import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "password_reset_requests")
public class PasswordResetRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "otp_hash", length = 255)
    private String otpHash;  // HMAC hashed OTP

    @Column(name = "token_type")
    @Enumerated(EnumType.STRING)
    private TokenType tokenType = TokenType.OTP;  // ENUM('OTP','LINK')

    @Column
    private int attempts = 0;

    @Column
    private boolean used = false;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();

    @Column(name = "request_ip", length = 45)
    private String requestIp;

    @Column(name = "user_agent")
    private String userAgent;

    // Enum cho token_type
    public enum TokenType {
        OTP, LINK
    }

    // Getters/Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getOtpHash() { return otpHash; }
    public void setOtpHash(String otpHash) { this.otpHash = otpHash; }
    public TokenType getTokenType() { return tokenType; }
    public void setTokenType(TokenType tokenType) { this.tokenType = tokenType; }
    public int getAttempts() { return attempts; }
    public void setAttempts(int attempts) { this.attempts = attempts; }
    public boolean isUsed() { return used; }
    public void setUsed(boolean used) { this.used = used; }
    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public String getRequestIp() { return requestIp; }
    public void setRequestIp(String requestIp) { this.requestIp = requestIp; }
    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }
}
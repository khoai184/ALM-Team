package com.tim.appTim.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "class_members")
public class ClassMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "lop_id", nullable = false)
    private Long classId;

    @Column(name = "nguoi_dung_id", nullable = false)
    private Long userId;

    @Column(name = "vai_tro")
    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "ngay_tham_gia")
    private LocalDateTime joinDate;

    @ManyToOne
    @JoinColumn(name = "lop_id", referencedColumnName = "id", insertable = false, updatable = false)
    private Class classEntity;

    @ManyToOne
    @JoinColumn(name = "nguoi_dung_id", referencedColumnName = "id", insertable = false, updatable = false)
    private User user;

    public enum Role {
        hoc_vien, giang_vien
    }

    // Getters/Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getClassId() { return classId; }
    public void setClassId(Long classId) { this.classId = classId; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public LocalDateTime getJoinDate() { return joinDate; }
    public void setJoinDate(LocalDateTime joinDate) { this.joinDate = joinDate; }
    public Class getClassEntity() { return classEntity; }
    public void setClassEntity(Class classEntity) { this.classEntity = classEntity; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
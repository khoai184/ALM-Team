package com.tim.appTim.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ranking")
public class Ranking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nguoi_dung_id", nullable = false)
    private Long userId;

    @Column(name = "diem_tong_hop")
    private Integer totalScore;

    @Column(name = "classes_id")
    private Long classId;

    @Column(name = "courses_id")
    private Long courseId;

    @Column(name = "update_time")
    private LocalDateTime updateTime;

    @ManyToOne
    @JoinColumn(name = "nguoi_dung_id", referencedColumnName = "id", insertable = false, updatable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "classes_id", referencedColumnName = "id", insertable = false, updatable = false)
    private Class classEntity;

    @ManyToOne
    @JoinColumn(name = "courses_id", referencedColumnName = "id", insertable = false, updatable = false)
    private Course course;

    // Getters/Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Integer getTotalScore() { return totalScore; }
    public void setTotalScore(Integer totalScore) { this.totalScore = totalScore; }
    public Long getClassId() { return classId; }
    public void setClassId(Long classId) { this.classId = classId; }
    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }
    public LocalDateTime getUpdateTime() { return updateTime; }
    public void setUpdateTime(LocalDateTime updateTime) { this.updateTime = updateTime; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Class getClassEntity() { return classEntity; }
    public void setClassEntity(Class classEntity) { this.classEntity = classEntity; }
    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }
}
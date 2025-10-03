package com.tim.appTim.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "courses")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ten_khoa_hoc")
    private String courseName;

    @Column(name = "mo_ta")
    private String description;

    @Column(name = "ngay_khai_giang")
    private LocalDate startDate;

    @Column(name = "hoc_phi")
    private Double tuitionFee;

    // Getters/Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public Double getTuitionFee() { return tuitionFee; }
    public void setTuitionFee(Double tuitionFee) { this.tuitionFee = tuitionFee; }
}
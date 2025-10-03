package com.tim.appTim.dto;

import java.time.LocalDate;

public class CourseDTO {
    private Long id;
    private String courseName;
    private String description;
    private LocalDate startDate;
    private Double tuitionFee;

    public CourseDTO(Long id, String courseName, String description, LocalDate startDate, Double tuitionFee) {
        this.id = id;
        this.courseName = courseName;
        this.description = description;
        this.startDate = startDate;
        this.tuitionFee = tuitionFee;
    }
    // Getters/Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate;}
    public Double getTuitionFee() { return tuitionFee; }
    public void setTuitionFee(Double tuitionFee) { this.tuitionFee = tuitionFee; }
}
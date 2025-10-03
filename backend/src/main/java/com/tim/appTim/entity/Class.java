package com.tim.appTim.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "classes")
public class Class {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ten_lop")
    private String className;

    @Column(name = "mo_ta")
    private String description;

    // Getters/Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
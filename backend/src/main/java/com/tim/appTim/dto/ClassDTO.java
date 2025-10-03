package com.tim.appTim.dto;

import java.time.LocalDateTime;
import java.util.List;

public class ClassDTO {
    private String className;
    private String description;
    private List<MemberDTO> members;

    public ClassDTO(String className, String description, List<MemberDTO> members) {
        this.className = className;
        this.description = description;
        this.members = members;
    }

    // Getters và Setters
    public String getClassName() { return className; }
    public String getDescription() { return description; }
    public List<MemberDTO> getMembers() { return members; }

    public static class MemberDTO {
        private Long userId;
        private String role;
        private LocalDateTime joinDate;

        public MemberDTO(Long userId, String role, LocalDateTime joinDate) {
            this.userId = userId;
            this.role = role;
            this.joinDate = joinDate;
        }

        // Getters và Setters
        public Long getUserId() { return userId; }
        public String getRole() { return role; }
        public LocalDateTime getJoinDate() { return joinDate; }
    }
}
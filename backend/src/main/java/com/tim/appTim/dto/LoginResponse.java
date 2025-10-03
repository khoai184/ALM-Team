package com.tim.appTim.dto;

public class LoginResponse {
private boolean success;
    private String message;
    private UserData data;

    public LoginResponse(boolean success, String message, UserData data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    // Getters/Setters
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public UserData getData() { return data; }
    public void setData(UserData data) { this.data = data; }

    public static class UserData {
        private Long id;
        private String email;
        private String username;
        private String role;
        private String token;

    public UserData(Long id, String email, String username, String role, String token) {
            this.id = id;
            this.email = email;
            this.username = username;
            this.role = role;
            this.token = token;
        }

    // Getters/Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }
    }
}
package com.tim.appTim.dto;

import java.util.List;

public class ProfileResponse {
    private UserData user;
    private List<PostData> posts;
    private List<ImageData> images;
    private List<CourseData> courses;

    public ProfileResponse() {}

    public ProfileResponse(UserData user, List<PostData> posts, List<ImageData> images, List<CourseData> courses) {
        this.user = user;
        this.posts = posts;
        this.images = images;
        this.courses = courses;
    }

    // Getters and Setters
    public UserData getUser() { return user; }
    public void setUser(UserData user) { this.user = user; }
    public List<PostData> getPosts() { return posts; }
    public void setPosts(List<PostData> posts) { this.posts = posts; }
    public List<ImageData> getImages() { return images; }
    public void setImages(List<ImageData> images) { this.images = images; }
    public List<CourseData> getCourses() { return courses; }
    public void setCourses(List<CourseData> courses) { this.courses = courses; }

    public static class UserData {
        private Long id;
        private String username;
        private String email;
        private String phoneNumber;
        private String profileImage;
        private String role;
        private String createdAt;

        public UserData() {}

        public UserData(Long id, String username, String email, String phoneNumber, String profileImage, String role, String createdAt) {
            this.id = id;
            this.username = username;
            this.email = email;
            this.phoneNumber = phoneNumber;
            this.profileImage = profileImage;
            this.role = role;
            this.createdAt = createdAt;
        }

        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPhoneNumber() { return phoneNumber; }
        public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
        public String getProfileImage() { return profileImage; }
        public void setProfileImage(String profileImage) { this.profileImage = profileImage; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public String getCreatedAt() { return createdAt; }
        public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    }

    public static class PostData {
        private Long id;
        private String content;
        private String privacy;
        private String createdAt;
        private String updatedAt;
        private List<CommentData> comments;
        private List<ReactionData> reactions;

        public PostData() {}

        public PostData(Long id, String content, String privacy, String createdAt, String updatedAt, List<CommentData> comments, List<ReactionData> reactions) {
            this.id = id;
            this.content = content;
            this.privacy = privacy;
            this.createdAt = createdAt;
            this.updatedAt = updatedAt;
            this.comments = comments;
            this.reactions = reactions;
        }

        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
        public String getPrivacy() { return privacy; }
        public void setPrivacy(String privacy) { this.privacy = privacy; }
        public String getCreatedAt() { return createdAt; }
        public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
        public String getUpdatedAt() { return updatedAt; }
        public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }
        public List<CommentData> getComments() { return comments; }
        public void setComments(List<CommentData> comments) { this.comments = comments; }
        public List<ReactionData> getReactions() { return reactions; }
        public void setReactions(List<ReactionData> reactions) { this.reactions = reactions; }
    }

    public static class CommentData {
        private Long id;
        private Long userId;
        private String username;
        private String content;
        private String emotion;
        private String fileId;
        private String createdAt;
        private List<ReplyCommentData> replyComments;

        public CommentData() {}

        public CommentData(Long id, Long userId, String username, String content, String emotion, String fileId, String createdAt, List<ReplyCommentData> replyComments) {
            this.id = id;
            this.userId = userId;
            this.username = username;
            this.content = content;
            this.emotion = emotion;
            this.fileId = fileId;
            this.createdAt = createdAt;
            this.replyComments = replyComments;
        }

        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
        public String getEmotion() { return emotion; }
        public void setEmotion(String emotion) { this.emotion = emotion; }
        public String getFileId() { return fileId; }
        public void setFileId(String fileId) { this.fileId = fileId; }
        public String getCreatedAt() { return createdAt; }
        public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
        public List<ReplyCommentData> getReplyComments() { return replyComments; }
        public void setReplyComments(List<ReplyCommentData> replyComments) { this.replyComments = replyComments; }
    }

    public static class ReplyCommentData {
        private Long id;
        private String content;
        private String emotion;
        private String fileId;
        private String createdAt;

        public ReplyCommentData() {}

        public ReplyCommentData(Long id, String content, String emotion, String fileId, String createdAt) {
            this.id = id;
            this.content = content;
            this.emotion = emotion;
            this.fileId = fileId;
            this.createdAt = createdAt;
        }

        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
        public String getEmotion() { return emotion; }
        public void setEmotion(String emotion) { this.emotion = emotion; }
        public String getFileId() { return fileId; }
        public void setFileId(String fileId) { this.fileId = fileId; }
        public String getCreatedAt() { return createdAt; }
        public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    }

    public static class ReactionData {
        private Long id;
        private Long userId;
        private String username;
        private String emotionType;
        private String createdAt;

        public ReactionData() {}

        public ReactionData(Long id, Long userId, String username, String emotionType, String createdAt) {
            this.id = id;
            this.userId = userId;
            this.username = username;
            this.emotionType = emotionType;
            this.createdAt = createdAt;
        }

        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmotionType() { return emotionType; }
        public void setEmotionType(String emotionType) { this.emotionType = emotionType; }
        public String getCreatedAt() { return createdAt; }
        public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    }

    public static class ImageData {
        private Long id;
        private String imageUrl;
        private String description;
        private String createdAt;

        public ImageData() {}

        public ImageData(Long id, String imageUrl, String description, String createdAt) {
            this.id = id;
            this.imageUrl = imageUrl;
            this.description = description;
            this.createdAt = createdAt;
        }

        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getCreatedAt() { return createdAt; }
        public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    }

    public static class CourseData {
        private Long id;
        private String courseName;
        private String description;
        private String startDate;
        private Double tuitionFee;

        public CourseData() {}

        public CourseData(Long id, String courseName, String description, String startDate, Double tuitionFee) {
            this.id = id;
            this.courseName = courseName;
            this.description = description;
            this.startDate = startDate;
            this.tuitionFee = tuitionFee;
        }

        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getCourseName() { return courseName; }
        public void setCourseName(String courseName) { this.courseName = courseName; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getStartDate() { return startDate; }
        public void setStartDate(String startDate) { this.startDate = startDate; }
        public Double getTuitionFee() { return tuitionFee; }
        public void setTuitionFee(Double tuitionFee) { this.tuitionFee = tuitionFee; }
    }
}
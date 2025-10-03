package com.tim.appTim.service;

import com.tim.appTim.dto.ProfileResponse;
import com.tim.appTim.entity.User;
import com.tim.appTim.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProfileService {

    @Autowired
    private UserRepository userRepository;

    public ProfileResponse getProfileByUserId(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return null;
        }

        // Convert role từ enum sang string
        String roleString = convertRoleToString(user.getRole());

        // Tạo UserData
        ProfileResponse.UserData userData = new ProfileResponse.UserData(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getProfileImage(),
                roleString,
                user.getCreatedAt() != null ? user.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
                        : LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

        // Tạo mock data cho posts, images, courses
        // TODO: Implement real data fetching from respective repositories
        List<ProfileResponse.PostData> posts = new ArrayList<>();
        List<ProfileResponse.ImageData> images = new ArrayList<>();
        List<ProfileResponse.CourseData> courses = new ArrayList<>();

        // Mock posts data
        posts.add(new ProfileResponse.PostData(
                1L,
                "Chào mừng đến với CodeGym!",
                "public",
                LocalDateTime.now().minusDays(1).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
                null,
                new ArrayList<>(),
                new ArrayList<>()));

        // Mock images data
        images.add(new ProfileResponse.ImageData(
                1L,
                "https://via.placeholder.com/300x200",
                "Ảnh bìa profile",
                LocalDateTime.now().minusDays(2).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)));

        // Mock courses data
        courses.add(new ProfileResponse.CourseData(
                1L,
                "Java Backend Development",
                "Khóa học phát triển backend với Java Spring Boot",
                LocalDateTime.now().plusDays(30).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
                5000000.0));

        return new ProfileResponse(userData, posts, images, courses);
    }

    private String convertRoleToString(User.Role role) {
        if (role == null)
            return "student";

        switch (role) {
            case sinh_vien:
                return "student";
            case giao_vien:
                return "teacher";
            case admin:
                return "admin";
            default:
                return "student";
        }
    }
}
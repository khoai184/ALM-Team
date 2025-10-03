package com.tim.appTim.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tim.appTim.entity.UserImage;

public interface UserImageRepository extends JpaRepository<UserImage, Long> {
    List<UserImage> findByUserId(Long userId);
    UserImage findTopByUserIdOrderByCreatedAtDesc(Long userId); // Thêm method này
}
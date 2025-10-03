package com.tim.appTim.service;

import java.util.List;

import com.tim.appTim.entity.UserImage;

public interface UserImageService {
    UserImage save(UserImage userImage);
    UserImage findLatestByUserId(Long userId);
    void delete(Long id);
    List<UserImage> findAllByUserId(Long userId);
    void deleteAllByUserId(Long userId);
}
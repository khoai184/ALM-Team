package com.tim.appTim.service;

import com.tim.appTim.entity.UserImage;
import com.tim.appTim.repository.UserImageRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class UserImageServiceImpl implements UserImageService {

    private static final Logger logger = LoggerFactory.getLogger(UserImageServiceImpl.class);

    @Autowired
    private UserImageRepository userImageRepository;

    @Value("${upload.folder:/path/to/upload}") // Default value nếu không cấu hình
    private String uploadFolder;

    @Override
    public UserImage save(UserImage userImage) {
        return userImageRepository.save(userImage);
    }

    @Override
    public UserImage findLatestByUserId(Long userId) {
        List<UserImage> userImages = userImageRepository.findByUserId(userId);
        if (userImages == null || userImages.isEmpty()) {
            return null;
        }
        Optional<UserImage> latestImage = userImages.stream()
                .max(Comparator.comparing(UserImage::getCreatedAt));
        return latestImage.orElse(null);
    }

    @Override
    public void delete(Long id) {
        UserImage userImage = userImageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Image not found"));
        try {
            String filePath = uploadFolder + File.separator + userImage.getImageUrl().substring("/uploads/".length());
            File file = new File(filePath);
            if (file.exists() && file.delete()) {
                logger.info("Deleted file: {}", filePath);
            }
        } catch (Exception e) {
            logger.error("Error deleting file for image ID {}: {}", id, e.getMessage());
        }
        userImageRepository.deleteById(id);
    }

    @Override
    public List<UserImage> findAllByUserId(Long userId) {
        return userImageRepository.findByUserId(userId);
    }

    @Override
    public void deleteAllByUserId(Long userId) {
        List<UserImage> userImages = userImageRepository.findByUserId(userId);
        if (userImages == null || userImages.isEmpty()) {
            return;
        }

        for (UserImage image : userImages) {
            try {
                String filePath = uploadFolder + File.separator + image.getImageUrl().substring("/uploads/".length());
                File file = new File(filePath);
                if (file.exists() && file.delete()) {
                    logger.info("Deleted file: {}", filePath);
                }
            } catch (Exception e) {
                logger.error("Error deleting file for image ID {}: {}", image.getId(), e.getMessage());
            }
        }
        userImageRepository.deleteAllById(userImages.stream().map(UserImage::getId).toList());
    }
}
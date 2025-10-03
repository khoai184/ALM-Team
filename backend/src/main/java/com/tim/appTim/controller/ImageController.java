package com.tim.appTim.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.tim.appTim.entity.User;
import com.tim.appTim.entity.UserImage;
import com.tim.appTim.service.UserImageService;
import com.tim.appTim.service.UserService;

@RestController
@RequestMapping("/api/users")
public class ImageController {

    private static final Logger logger = LoggerFactory.getLogger(ImageController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private UserImageService userImageService;

    @Value("${upload.folder}")
    private String uploadFolder;

    @PostMapping("/{userId}/avatar")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<String> uploadAvatar(@PathVariable Long userId, @RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }

        try {
            File uploadDir = new File(uploadFolder);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            String originalFilename = file.getOriginalFilename();
            String fileExtension = (originalFilename != null && originalFilename.contains("."))
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : ".jpg";
            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

            Path filePath = Paths.get(uploadFolder + File.separator + uniqueFilename);
            Files.write(filePath, file.getBytes());

            User user = userService.findById(userId);
            if (user == null) {
                Files.deleteIfExists(filePath); // Xóa file nếu user không tồn tại
                return ResponseEntity.notFound().build();
            }

            UserImage userImage = new UserImage();
            userImage.setUserId(userId);
            userImage.setImageUrl("/uploads/" + uniqueFilename);
            userImage.setCreatedAt(LocalDateTime.now());
            userImageService.save(userImage);

            logger.info("Avatar uploaded for userId {}: {}", userId, uniqueFilename);
            return ResponseEntity.ok("Avatar uploaded successfully: " + uniqueFilename);
        } catch (IOException e) {
            logger.error("Failed to upload avatar for userId {}: {}", userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload avatar: " + e.getMessage());
        }
    }

    @GetMapping("/{userId}/avatar")
    public ResponseEntity<String> getAvatar(@PathVariable Long userId) {
        UserImage userImage = userImageService.findLatestByUserId(userId);
        if (userImage == null || userImage.getImageUrl() == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(userImage.getImageUrl());
    }

    @GetMapping("/{userId}/images")
    public ResponseEntity<List<UserImage>> getAllImages(@PathVariable Long userId) {
        List<UserImage> userImages = userImageService.findAllByUserId(userId);
        if (userImages == null || userImages.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(userImages);
    }

    @DeleteMapping("/{userId}/avatar")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<String> deleteAvatar(@PathVariable Long userId) {
        UserImage userImage = userImageService.findLatestByUserId(userId);
        if (userImage == null || userImage.getImageUrl() == null) {
            return ResponseEntity.notFound().build();
        }

        userImageService.delete(userImage.getId());
        logger.info("Avatar deleted for userId: {}", userId);
        return ResponseEntity.ok("Avatar deleted successfully");
    }

    @DeleteMapping("/{userId}/images")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<String> deleteAllImages(@PathVariable Long userId) {
        List<UserImage> userImages = userImageService.findAllByUserId(userId);
        if (userImages == null || userImages.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        userImageService.deleteAllByUserId(userId);
        logger.info("All images deleted for userId: {}", userId);
        return ResponseEntity.ok("All images deleted successfully");
    }
}
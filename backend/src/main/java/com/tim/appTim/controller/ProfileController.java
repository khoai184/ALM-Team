package com.tim.appTim.controller;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tim.appTim.dto.ProfileResponse;
import com.tim.appTim.dto.UserImageDTO;
import com.tim.appTim.entity.User;
import com.tim.appTim.service.UserService;
import com.tim.appTim.service.ProfileService;


@RestController
@RequestMapping("/profile")
@CrossOrigin(origins = "http://localhost:5173")
public class ProfileController {

    private final UserService userService;
    private final ProfileService profileService;

    public ProfileController(UserService userService, ProfileService profileService) {
        this.userService = userService;
        this.profileService = profileService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getProfile(@PathVariable Long userId) {
        try {
            ProfileResponse profile = profileService.getProfileByUserId(userId);
            if (profile == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching profile: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> update(@PathVariable Long id, @RequestBody User user) {
        return ResponseEntity.ok(userService.update(id, user));
    }

    @GetMapping("/{userId}/images")
    public ResponseEntity<List<UserImageDTO>> getUserImages(@PathVariable Long userId) {
        List<UserImageDTO> images = userService.getUserImages(userId);
        return ResponseEntity.ok(images);
    }
    
    // CREATE
    @PostMapping("/{userId}/images")
    public ResponseEntity<UserImageDTO> createUserImage(
            @PathVariable Long userId,
            @RequestBody Map<String, String> requestBody) {
        String imageUrl = requestBody.get("imageUrl");
        String description = requestBody.get("description");
        if (imageUrl == null || imageUrl.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        UserImageDTO created = userService.createUserImage(userId, imageUrl, description);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // UPDATE
    @PutMapping("/{userId}/images/{imageId}")
    public ResponseEntity<UserImageDTO> updateUserImage(
            @PathVariable Long userId,
            @PathVariable Long imageId,
            @RequestBody Map<String, String> requestBody) {
        String imageUrl = requestBody.get("imageUrl");
        String description = requestBody.get("description");
        UserImageDTO updated = userService.updateUserImage(userId, imageId, imageUrl, description);
        return ResponseEntity.ok(updated);
    }

    // DELETE
    @DeleteMapping("/{userId}/images/{imageId}")
    public ResponseEntity<Void> deleteUserImage(
            @PathVariable Long userId,
            @PathVariable Long imageId) {
        userService.deleteUserImage(userId, imageId);
        return ResponseEntity.noContent().build();
    }
}
package com.tim.appTim.controller;

import java.util.Map;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.tim.appTim.dto.LoginRequest;
import com.tim.appTim.dto.LoginResponse;
import com.tim.appTim.entity.User;
import com.tim.appTim.service.PasswordResetService;
import com.tim.appTim.service.UserService;
import com.tim.appTim.util.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;


@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final PasswordResetService passwordResetService;


    public AuthController(UserService userService, JwtUtil jwtUtil, AuthenticationManager authenticationManager, PasswordResetService passwordResetService) {
    this.userService = userService;
    this.jwtUtil = jwtUtil;
    this.authenticationManager = authenticationManager;
    this.passwordResetService = passwordResetService;
}
    

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        userService.register(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsernameOrEmail(), loginRequest.getPassword()
                )
            );

            SecurityContextHolder.getContext().setAuthentication(auth);

            // Lấy thông tin user từ database
            User user = userService.findByUsernameOrEmail(loginRequest.getUsernameOrEmail());
            if (user == null) {
                return ResponseEntity.status(401).body("User not found");
            }

            String token = jwtUtil.generateToken(loginRequest.getUsernameOrEmail());

            // Convert role từ enum sang string phù hợp với frontend
            String roleString = convertRoleToString(user.getRole());

            LoginResponse.UserData userData = new LoginResponse.UserData(
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                roleString,
                token
            );

            LoginResponse response = new LoginResponse(true, "Login successful", userData);
            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body("Login failed: " + e.getMessage());
        }
    }

    private String convertRoleToString(User.Role role) {
        if (role == null) return "student";
        
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

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        // Với JWT stateless → logout chỉ cần client xóa token
        return ResponseEntity.ok("Logout successful. Please remove token from client.");
    }

    // Thêm endpoints
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> requestBody, HttpServletRequest request) {
        String email = requestBody.get("email");
        String ip = request.getRemoteAddr();
        String userAgent = request.getHeader("User-Agent");
        passwordResetService.requestReset(email, ip, userAgent);
        return ResponseEntity.ok("Nếu có tài khoản, chúng tôi đã gửi hướng dẫn đến email.");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");
        String otp = requestBody.get("otp");
        try {
            String resetToken = passwordResetService.verifyOtp(email, otp);
            return ResponseEntity.ok(Map.of("reset_token", resetToken));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");
        String resetToken = requestBody.get("reset_token");
        String newPassword = requestBody.get("newPassword");
        try {
            passwordResetService.resetPassword(email, resetToken, newPassword);
            return ResponseEntity.ok("Mật khẩu đã được thay đổi.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Configuration
    public class WebConfig implements WebMvcConfigurer {
        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/**")
                    .allowedOrigins("http://localhost:5173")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
        }
    }
        
}

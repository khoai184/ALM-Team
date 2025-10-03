package com.tim.appTim.service;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Optional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.tim.appTim.entity.PasswordResetRequest;
import com.tim.appTim.entity.PasswordResetRequest.TokenType;
import com.tim.appTim.entity.User;
import com.tim.appTim.repository.PasswordResetRequestRepository;

@Service
public class PasswordResetService {
    private static final Logger logger = LoggerFactory.getLogger(PasswordResetService.class);
    private static final int OTP_LENGTH = 6;
    private static final int OTP_TTL_MINUTES = 10;
    private static final int RESET_TOKEN_TTL_MINUTES = 15;
    private static final int MAX_ATTEMPTS = 5;
    private static final String HMAC_ALGO = "HmacSHA256";

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordResetRequestRepository resetRepo;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private PasswordEncoder passwordEncoder;  // BCrypt cho password, nhưng dùng HMAC cho OTP

    @Value("${app.pepper}")  // Từ application.properties
    private String pepper;

    public void requestReset(String email, String requestIp, String userAgent) {
        // Rate limit here (e.g., 1 request / 60s, max 3 / 24h) - TODO: Implement with Redis or Guava

        User user = userService.findByUsernameOrEmail(email);  // Nếu không tồn tại, không throw error để tránh leak info
        if (user == null) {
            logger.info("Reset request for non-existing email: {}", email);
            return;  // Silent fail
        }

        // Tạo OTP
        String otp = generateOtp();
        String otpHash = hashOtp(otp);

        // Lưu request
        PasswordResetRequest request = new PasswordResetRequest();
        request.setUser(user);
        request.setOtpHash(otpHash);
        request.setTokenType(TokenType.OTP);
        request.setExpiresAt(Instant.now().plus(OTP_TTL_MINUTES, ChronoUnit.MINUTES));
        request.setRequestIp(requestIp);
        request.setUserAgent(userAgent);
        resetRepo.save(request);

        // Send email (async nếu cần)
        sendOtpEmail(user.getEmail(), otp);
        logger.info("OTP sent for user: {}", user.getId());
    }

    public String verifyOtp(String email, String otp) {
        // Rate limit here

        User user = userService.findByUsernameOrEmail(email);
        if (user == null) {
            throw new IllegalArgumentException("Invalid request");
        }

        Optional<PasswordResetRequest> optRequest = resetRepo.findTopByUserAndUsedFalseOrderByCreatedAtDesc(user);
        if (optRequest.isEmpty()) {
            throw new IllegalArgumentException("No active reset request");
        }

        PasswordResetRequest request = optRequest.get();
        if (request.getExpiresAt().isBefore(Instant.now())) {
            throw new IllegalArgumentException("OTP expired. Please request a new one.");
        }

        String otpHashCandidate = hashOtp(otp);
        if (!otpHashCandidate.equals(request.getOtpHash())) {
            request.setAttempts(request.getAttempts() + 1);
            if (request.getAttempts() >= MAX_ATTEMPTS) {
                request.setUsed(true);
            }
            resetRepo.save(request);
            throw new IllegalArgumentException("Invalid OTP");
        }

        // Success: Mark used, create reset token
        request.setUsed(true);
        resetRepo.save(request);

        String resetToken = generateResetToken();
        String resetTokenHash = passwordEncoder.encode(resetToken);  // Use BCrypt for reset token hash

        // Tạo request mới cho reset token (hoặc update existing)
        PasswordResetRequest tokenRequest = new PasswordResetRequest();
        tokenRequest.setUser(user);
        tokenRequest.setOtpHash(resetTokenHash);  // Reuse otp_hash field for reset_token_hash
        tokenRequest.setTokenType(TokenType.LINK);
        tokenRequest.setExpiresAt(Instant.now().plus(RESET_TOKEN_TTL_MINUTES, ChronoUnit.MINUTES));
        resetRepo.save(tokenRequest);

        return resetToken;  // Return plain reset_token cho client (client gửi lại ở reset-password)
    }

    public void resetPassword(String email, String resetToken, String newPassword) {
    // Validate new password policy (e.g., length >=8, etc.) - TODO: Implement
    User user = userService.findByUsernameOrEmail(email);
    if (user == null) {
        throw new IllegalArgumentException("Invalid request");
    }
    Optional<PasswordResetRequest> optRequest = resetRepo.findTopByUserAndUsedFalseOrderByCreatedAtDesc(user);
    if (optRequest.isEmpty() || optRequest.get().getTokenType() != TokenType.LINK) {
        throw new IllegalArgumentException("No active reset token");
    }
    PasswordResetRequest request = optRequest.get();
    if (request.getExpiresAt().isBefore(Instant.now()) || request.isUsed()) {
        throw new IllegalArgumentException("Invalid or expired reset token");
    }
    if (!passwordEncoder.matches(resetToken, request.getOtpHash())) {  // Check hash match
        throw new IllegalArgumentException("Invalid reset token");
    }
    // Reset password - Encode chỉ một lần
    String encodedPassword = passwordEncoder.encode(newPassword);
    user.setPassword(encodedPassword);
    user.setPasswordChangedAt(Instant.now());
    userService.update(user.getId(), user); // Truyền user đã encode
    // Mark used
    request.setUsed(true);
    resetRepo.save(request);
    // Send confirmation email
    sendConfirmationEmail(user.getEmail());
    logger.info("Password reset for user: {}, encoded password starts with: {}", user.getId(), encodedPassword.substring(0, 10));
    }

    // Helper methods
    private String generateOtp() {
        SecureRandom random = new SecureRandom();
        StringBuilder otp = new StringBuilder(OTP_LENGTH);
        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(random.nextInt(10));
        }
        return otp.toString();
    }

    private String hashOtp(String otp) {
        try {
            Mac mac = Mac.getInstance(HMAC_ALGO);
            SecretKeySpec keySpec = new SecretKeySpec(pepper.getBytes(StandardCharsets.UTF_8), HMAC_ALGO);
            mac.init(keySpec);
            byte[] hash = mac.doFinal(otp.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException("Error hashing OTP", e);
        }
    }

    private String generateResetToken() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[32];  // 32 bytes random
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private void sendOtpEmail(String email, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Password Reset OTP");
        message.setText("Your OTP is: " + otp + "\nIt expires in " + OTP_TTL_MINUTES + " minutes. Do not share this with anyone.");
        mailSender.send(message);
    }

    private void sendConfirmationEmail(String email) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Password Changed");
        message.setText("Your password has been successfully changed.");
        mailSender.send(message);
    }

}
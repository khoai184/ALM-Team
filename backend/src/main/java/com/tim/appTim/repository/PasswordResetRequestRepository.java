package com.tim.appTim.repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tim.appTim.entity.PasswordResetRequest;
import com.tim.appTim.entity.User;

public interface PasswordResetRequestRepository extends JpaRepository<PasswordResetRequest, Long> {
    Optional<PasswordResetRequest> findTopByUserAndUsedFalseOrderByCreatedAtDesc(User user);  // Tìm latest non-used request
}

package com.tim.appTim.repository;

import com.tim.appTim.entity.Reaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReactionRepository extends JpaRepository<Reaction, Long> {
    List<Reaction> findByPostId(Long postId);
}
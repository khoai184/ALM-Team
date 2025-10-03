package com.tim.appTim.repository;

import com.tim.appTim.entity.ReplyComment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReplyCommentRepository extends JpaRepository<ReplyComment, Long> {
    List<ReplyComment> findByCommentId(Long commentId);
}
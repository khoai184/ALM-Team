package com.tim.appTim.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.tim.appTim.dto.CommentDTO;
import com.tim.appTim.dto.CourseDTO;
import com.tim.appTim.dto.PostDTO;
import com.tim.appTim.dto.ProfileResponse;
import com.tim.appTim.dto.ReactionDTO;
import com.tim.appTim.dto.ReplyCommentDTO;
import com.tim.appTim.dto.UserImageDTO;
import com.tim.appTim.entity.User;
import com.tim.appTim.entity.UserImage;
import com.tim.appTim.repository.ClassMemberRepository;
import com.tim.appTim.repository.CommentRepository;
import com.tim.appTim.repository.CourseRepository;
import com.tim.appTim.repository.PostRepository;
import com.tim.appTim.repository.ReactionRepository;
import com.tim.appTim.repository.ReplyCommentRepository;
import com.tim.appTim.repository.UserImageRepository;
import com.tim.appTim.repository.UserRepository;

@Service
public class UserService implements UserDetailsService {

    @Value("${upload.folder}")
    private String uploadDir;

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final ReplyCommentRepository replyCommentRepository;
    private final ReactionRepository reactionRepository;
    private final UserImageRepository userImageRepository;
    private final ClassMemberRepository classMemberRepository;
    private final CourseRepository courseRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    
    
    public UserService(UserRepository userRepository, PostRepository postRepository, CommentRepository commentRepository,
                       ReplyCommentRepository replyCommentRepository, ReactionRepository reactionRepository,
                       UserImageRepository userImageRepository, ClassMemberRepository classMemberRepository,
                       CourseRepository courseRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.replyCommentRepository = replyCommentRepository;
        this.reactionRepository = reactionRepository;
        this.userImageRepository = userImageRepository;
        this.classMemberRepository = classMemberRepository;
        this.courseRepository = courseRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void register(User user) {
        if (user.getEmail() == null || user.getEmail().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        return userRepository.findByUsername(usernameOrEmail)
                .or(() -> userRepository.findByEmail(usernameOrEmail))
                .map(UserDetailsImpl::new)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username or email: " + usernameOrEmail));
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    public User create(User user) {
        if (user.getEmail() == null || user.getEmail().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User update(Long id, User user) {
    User existingUser = findById(id);
    existingUser.setUsername(user.getUsername());
    existingUser.setEmail(user.getEmail());
    // Không encode lại password, chỉ gán giá trị đã encode từ resetPassword
    if (user.getPassword() != null && !user.getPassword().isEmpty()) {
        existingUser.setPassword(user.getPassword()); // Gán trực tiếp
    }
    return userRepository.save(existingUser);
}

    public void delete(Long id) {
        userRepository.deleteById(id);
    }

    public java.util.List<User> findAll() {
        return userRepository.findAll();
    }

    public User findByUsernameOrEmail(String usernameOrEmail) {
    return userRepository.findByUsername(usernameOrEmail)
            .or(() -> userRepository.findByEmail(usernameOrEmail))
            .orElse(null); // Trả về null thay vì ném ngoại lệ
}

    public ProfileResponse getUserProfile(Long userId) {
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

    List<PostDTO> posts = postRepository.findByUserId(userId).stream().map(post -> {
        List<CommentDTO> comments = commentRepository.findByPostId(post.getId()).stream().map(comment -> {
            List<ReplyCommentDTO> replyComments = replyCommentRepository.findByCommentId(comment.getId()).stream()
                    .map(reply -> new ReplyCommentDTO(reply.getId(), reply.getContent(), reply.getEmotion(), reply.getFileId(), reply.getCreatedAt()))
                    .collect(Collectors.toList());
            return new CommentDTO(comment.getId(), comment.getUserId(), comment.getUser().getUsername(), // Sửa ở đây
                    comment.getContent(), comment.getEmotion() != null ? comment.getEmotion().name() : null,
                    comment.getFileId(), comment.getCreatedAt(), replyComments);
        }).collect(Collectors.toList());

        List<ReactionDTO> reactions = reactionRepository.findByPostId(post.getId()).stream()
                .map(reaction -> new ReactionDTO(reaction.getId(), reaction.getUserId(), reaction.getUser().getUsername(), // Sửa ở đây
                        reaction.getEmotionType() != null ? reaction.getEmotionType().name() : null,
                        reaction.getCreatedAt()))
                .collect(Collectors.toList());

        return new PostDTO(post.getId(), post.getContent(), post.getPrivacy() != null ? post.getPrivacy().name() : null,
                post.getCreatedAt(), post.getUpdatedAt(), comments, reactions);
    }).collect(Collectors.toList());

    List<UserImageDTO> images = userImageRepository.findByUserId(userId).stream()
            .map(image -> new UserImageDTO(image.getId(), image.getImageUrl(), image.getDescription(), image.getCreatedAt()))
            .collect(Collectors.toList());

    List<CourseDTO> courses = classMemberRepository.findByClassId(userId).stream()
            .map(classMember -> courseRepository.findById(classMember.getClassId())
                    .map(course -> new CourseDTO(course.getId(), course.getCourseName(), course.getDescription(),
                            course.getStartDate(), course.getTuitionFee()))
                    .orElse(null))
            .filter(course -> course != null)
            .collect(Collectors.toList());

    return new ProfileResponse(user, posts, images, courses);
}

    public List<UserImageDTO> getUserImages(Long userId) {
    return userImageRepository.findByUserId(userId)
        .stream()
        .map(image -> new UserImageDTO(
            image.getId(),
            image.getImageUrl(),
            image.getDescription(),
            image.getCreatedAt()
        ))
        .collect(Collectors.toList());
    }

        public UserImageDTO createUserImage(Long userId, String imageUrl, String description) {
        UserImage image = new UserImage();
        image.setUser(userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found")));
        image.setImageUrl(imageUrl);
        image.setDescription(description);
        image.setCreatedAt( LocalDateTime.now());
        
        UserImage saved = userImageRepository.save(image);
        return convertToDTO(saved);
    }

        public UserImageDTO updateUserImage(Long userId, Long imageId, String imageUrl, String description) {
        UserImage image = userImageRepository.findById(imageId)
            .orElseThrow(() -> new RuntimeException("Image not found"));
        
        // Kiểm tra quyền: Chỉ update nếu thuộc userId
        if (!image.getUser().getId().equals(userId)) {
            throw new SecurityException("You can only update your own images");
        }
        
        if (imageUrl != null) image.setImageUrl(imageUrl);
        if (description != null) image.setDescription(description);
        image.setCreatedAt( LocalDateTime.now());  // Optional: update timestamp
        
        UserImage saved = userImageRepository.save(image);
        return convertToDTO(saved);
    }


        public void deleteUserImage(Long userId, Long imageId) {
        UserImage image = userImageRepository.findById(imageId)
            .orElseThrow(() -> new RuntimeException("Image not found"));
        
        // Kiểm tra quyền
        if (!image.getUser().getId().equals(userId)) {
            throw new SecurityException("You can only delete your own images");
        }
        
        userImageRepository.delete(image);
    }

    private UserImageDTO convertToDTO(UserImage image) {
        return new UserImageDTO(
            image.getId(),
            image.getImageUrl(),
            image.getDescription(),
            image.getCreatedAt()
        );
    }


    

}
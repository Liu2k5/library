package com.sbagroup5.library.service.user;

import java.time.ZoneId;

import com.sbagroup5.library.entity.user.User;
import com.sbagroup5.library.exception.BusinessException;
import com.sbagroup5.library.record.user.UpdateProfileRequest;
import com.sbagroup5.library.record.user.UserProfileResponse;
import com.sbagroup5.library.repository.user.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    /**
     * Get user profile by username
     */
    public UserProfileResponse getProfile(String username) {
        User user = userRepository.findById(username)
                .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "User not found"));

        return new UserProfileResponse(
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getPhone(),
                user.getAddress(),
                user.getRole().getName(),
                user.getUserStatus(),
                user.getCreatedAt().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime());
    }

    /**
     * Get user by username
     */
    public User getUserByUsername(String username) {
        return userRepository.findById(username)
                .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "User not found"));
    }

    /**
     * Update user profile (fullName, phone, address only)
     */
    @Transactional
    public UserProfileResponse updateProfile(String username, UpdateProfileRequest request) {
        User user = userRepository.findById(username)
                .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "User not found"));

        // Check phone uniqueness (if changed)
        if (!user.getPhone().equals(request.phone()) &&
                userRepository.existsByPhone(request.phone())) {
            throw new BusinessException("PHONE_EXISTS", "Phone number already exists");
        }

        // Update editable fields
        user.setFullName(request.fullName());
        user.setPhone(request.phone());
        user.setAddress(request.address());

        userRepository.save(user);

        return new UserProfileResponse(
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getPhone(),
                user.getAddress(),
                user.getRole().getName(),
                user.getUserStatus(),
                user.getCreatedAt().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime());
    }
}
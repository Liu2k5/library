package com.sbagroup5.library.record.user;

import java.time.LocalDateTime;

import com.sbagroup5.library.entity.user.UserStatus;

public record UserProfileResponse(
        String username,
        String email,
        String fullName,
        String phone,
        String address,
        String role,
        UserStatus userStatus,
        LocalDateTime createdAt) {
}
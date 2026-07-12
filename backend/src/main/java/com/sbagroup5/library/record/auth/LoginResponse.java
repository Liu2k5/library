package com.sbagroup5.library.record.auth;

import com.sbagroup5.library.entity.user.UserStatus;

public record LoginResponse(
        String username,
        String email,
        String fullname,
        String role,
        UserStatus userStatus,
        String message) {
}

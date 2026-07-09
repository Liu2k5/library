package com.sbagroup5.library.record.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequest(
        @NotBlank(message = "Token is required") String token,

        @NotBlank(message = "New password is required") @Size(min = 6, max = 72, message = "Password must be between 6 and 72 characters") String newPassword,

        @NotBlank(message = "Confirmation password is required") @Size(min = 6, max = 72, message = "Password must be between 6 and 72 characters") String confirmPassword) {
}
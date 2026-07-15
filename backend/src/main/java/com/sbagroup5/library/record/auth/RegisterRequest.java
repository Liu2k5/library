package com.sbagroup5.library.record.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Username is required") @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters") @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Username can only contain letters, numbers, and underscores") String username,

        @NotBlank(message = "Email is required") @Email(message = "Invalid email format") @Size(max = 100, message = "Email must not exceed 100 characters") String email,

        @NotBlank(message = "Password is required") @Size(min = 6, max = 72, message = "Password must be between 6 and 72 characters") String password,

        @NotBlank(message = "Full name is required") @Size(max = 100, message = "Full name must not exceed 100 characters") String fullName,

        @NotBlank(message = "Phone number is required") @Pattern(regexp = "^[0-9]{10,11}$", message = "Phone number must be 10-11 digits") String phone,

        String address) {
}
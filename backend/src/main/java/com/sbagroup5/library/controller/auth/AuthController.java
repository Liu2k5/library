package com.sbagroup5.library.controller.auth;

import java.util.Map;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

import com.sbagroup5.library.record.auth.ChangePasswordRequest;
import com.sbagroup5.library.record.auth.ForgotPasswordRequest;
import com.sbagroup5.library.record.auth.LoginRequest;
import com.sbagroup5.library.record.auth.LoginResponse;
import com.sbagroup5.library.record.auth.RegisterRequest;
import com.sbagroup5.library.record.auth.ResetPasswordRequest;
import com.sbagroup5.library.service.auth.AuthService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Login endpoint
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Logout endpoint
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpSession session) {
        session.invalidate();
        authService.logout();
        return ResponseEntity.ok(Map.of("message", "Logout successful"));
    }

    /**
     * Get current user info
     */
    @GetMapping("/me")
    public ResponseEntity<LoginResponse> getCurrentUser() {
        LoginResponse response = authService.getCurrentUserInfo();
        return ResponseEntity.ok(response);
    }

    /**
     * Register new user
     */
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Map<String, String>> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Registration successful. Please check your email for confirmation."));
    }

    /**
     * Forgot password - send reset link to email
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok(Map.of(
                "message", "Password reset link has been sent to your email address"));
    }

    /**
     * Reset password using token
     */
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(Map.of(
                "message", "Password has been reset successfully"));
    }

    /**
     * Change password for authenticated user
     */
    @PostMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(request);
        return ResponseEntity.ok(Map.of(
                "message", "Password changed successfully"));
    }
}
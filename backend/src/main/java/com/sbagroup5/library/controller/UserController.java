package com.sbagroup5.library.controller;

import jakarta.validation.Valid;

import com.sbagroup5.library.record.user.UpdateProfileRequest;
import com.sbagroup5.library.record.user.UserProfileResponse;
import com.sbagroup5.library.service.auth.AuthService;
import com.sbagroup5.library.service.user.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final AuthService authService;

    /**
     * Get current user profile
     */
    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile() {
        String username = authService.getCurrentUser().getUsername();
        UserProfileResponse response = userService.getProfile(username);
        return ResponseEntity.ok(response);
    }

    /**
     * Update current user profile
     */
    @PutMapping("/profile")
    public ResponseEntity<UserProfileResponse> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        String username = authService.getCurrentUser().getUsername();
        UserProfileResponse response = userService.updateProfile(username, request);
        return ResponseEntity.ok(response);
    }
}
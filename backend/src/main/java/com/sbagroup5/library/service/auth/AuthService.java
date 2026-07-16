package com.sbagroup5.library.service.auth;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import com.sbagroup5.library.entity.auth.PasswordResetToken;
import com.sbagroup5.library.entity.user.Role;
import com.sbagroup5.library.entity.user.User;
import com.sbagroup5.library.entity.user.UserStatus;
import com.sbagroup5.library.exception.BusinessException;
import com.sbagroup5.library.record.auth.ChangePasswordRequest;
import com.sbagroup5.library.record.auth.ForgotPasswordRequest;
import com.sbagroup5.library.record.auth.LoginRequest;
import com.sbagroup5.library.record.auth.LoginResponse;
import com.sbagroup5.library.record.auth.RegisterRequest;
import com.sbagroup5.library.record.auth.ResetPasswordRequest;
import com.sbagroup5.library.repository.auth.PasswordResetTokenRepository;
import com.sbagroup5.library.repository.user.UserRepository;
import com.sbagroup5.library.service.EmailService;
import com.sbagroup5.library.service.user.RoleService;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleService roleService;
    private final EmailService emailService;
    private final PasswordResetTokenRepository tokenRepository;

    @Value("${app.reset-password-url}")
    private String resetPasswordUrl;

    /**
     * Login with email and password
     */
    @Transactional
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new BusinessException("INVALID_CREDENTIALS", "Invalid email or password"));

        if (user.getUserStatus() != UserStatus.ACTIVE) {
            throw new BusinessException("ACCOUNT_INACTIVE", "Account is not active.");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), request.password()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        SecurityContext context = SecurityContextHolder.getContext();
        HttpServletRequest httpRequest = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes())
                .getRequest();
        HttpSession session = httpRequest.getSession(true);
        session.setAttribute("SPRING_SECURITY_CONTEXT", context);

        return new LoginResponse(
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getRole().getName(),
                user.getUserStatus(),
                "Login successful");
    }

    /**
     * Logout - handled by SecurityConfig logout
     */
    public void logout() {
        SecurityContextHolder.clearContext();
    }

    /**
     * Get current authenticated user
     */
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BusinessException("UNAUTHENTICATED", "User not authenticated");
        }

        String username = authentication.getName();
        return userRepository.findById(username)
                .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "User not found"));
    }

    /**
     * Get current user info
     */
    public LoginResponse getCurrentUserInfo() {
        User user = getCurrentUser();
        return new LoginResponse(
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getRole().getName(),
                user.getUserStatus(),
                "User info retrieved successfully");
    }

    /**
     * Register new user
     */
    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new BusinessException("USERNAME_EXISTS", "Username already exists");
        }

        if (userRepository.existsByEmail(request.email())) {
            throw new BusinessException("EMAIL_EXISTS", "Email already exists");
        }

        if (userRepository.existsByPhone(request.phone())) {
            throw new BusinessException("PHONE_EXISTS", "Phone number already exists");
        }

        Role readerRole = roleService.findByName("MEMBER")
                .orElseThrow(() -> new BusinessException("ROLE_NOT_FOUND", "MEMBER role not found"));

        User user = new User();
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setFullName(request.fullName());
        user.setPhone(request.phone());
        user.setAddress(request.address());
        user.setRole(readerRole);
        user.setUserStatus(UserStatus.ACTIVE);
        user.setCreatedAt(new Date());

        userRepository.save(user);

        String emailContent = String.format(
                "Welcome to Library Management System, %s!\n\n" +
                        "Your account has been successfully created.\n" +
                        "Username: %s\n" +
                        "Email: %s\n\n" +
                        "You can now login to the system.\n\n" +
                        "Best regards,\n" +
                        "Library Management Team",
                request.fullName(),
                request.username(),
                request.email());

        emailService.sendSimpleEmail(
                request.email(),
                "Welcome to Library Management System",
                emailContent);
    }

    /**
     * Forgot password - generate token and send email
     */
    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new BusinessException("EMAIL_NOT_FOUND", "Email not found"));

        // Check if user is active
        if (user.getUserStatus() != UserStatus.ACTIVE) {
            throw new BusinessException("ACCOUNT_INACTIVE", "Account is not active. Please contact administrator.");
        }

        // Delete existing tokens for this user
        tokenRepository.deleteByUserUsername(user.getUsername());

        // Generate new token
        String tokenValue = UUID.randomUUID().toString();
        PasswordResetToken token = new PasswordResetToken();
        token.setToken(tokenValue);
        token.setUser(user);
        token.setCreatedAt(LocalDateTime.now());
        token.setExpiredAt(LocalDateTime.now().plusHours(24));
        token.setUsed(false);

        tokenRepository.save(token);

        // Send reset link email
        String resetLink = resetPasswordUrl + "/reset-password?token=" + tokenValue;
        String emailContent = String.format(
                "Password Reset Request\n\n" +
                        "Hello %s,\n\n" +
                        "We received a request to reset your password for Library Management System.\n\n" +
                        "Please click the link below to reset your password:\n" +
                        "%s\n\n" +
                        "This link will expire in 24 hours.\n\n" +
                        "If you did not request a password reset, please ignore this email.\n\n" +
                        "Best regards,\n" +
                        "Library Management Team",
                user.getFullName(),
                resetLink);

        emailService.sendSimpleEmail(
                user.getEmail(),
                "Password Reset Request - Library Management System",
                emailContent);
    }

    /**
     * Reset password using token
     */
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        if (!request.newPassword().equals(request.confirmPassword())) {
            throw new BusinessException("PASSWORDS_MISMATCH", "Passwords do not match");
        }

        PasswordResetToken token = tokenRepository.findByToken(request.token())
                .orElseThrow(() -> new BusinessException("INVALID_TOKEN", "Invalid or expired token"));

        if (!token.isValid()) {
            if (token.isUsed()) {
                throw new BusinessException("TOKEN_USED", "Token has already been used");
            }
            if (token.isExpired()) {
                throw new BusinessException("TOKEN_EXPIRED", "Token has expired");
            }
            throw new BusinessException("INVALID_TOKEN", "Invalid token");
        }

        User user = token.getUser();

        if (user.getUserStatus() != UserStatus.ACTIVE) {
            throw new BusinessException("ACCOUNT_INACTIVE", "Account is not active. Please contact administrator.");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

        token.setUsed(true);
        tokenRepository.save(token);

        String emailContent = String.format(
                "Password Reset Successful\n\n" +
                        "Hello %s,\n\n" +
                        "Your password has been successfully reset for Library Management System.\n\n" +
                        "If you did not perform this action, please contact us immediately.\n\n" +
                        "Best regards,\n" +
                        "Library Management Team",
                user.getFullName());

        emailService.sendSimpleEmail(
                user.getEmail(),
                "Password Reset Successful - Library Management System",
                emailContent);
    }

    /**
     * Change password for authenticated user
     */
    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        if (!request.newPassword().equals(request.confirmPassword())) {
            throw new BusinessException("PASSWORD_MISMATCH", "Passwords do not match");
        }

        User currentUser = getCurrentUser();

        if (!passwordEncoder.matches(request.currentPassword(), currentUser.getPassword())) {
            throw new BusinessException("INVALID_CURRENT_PASSWORD", "Current password is incorrect");
        }

        if (passwordEncoder.matches(request.newPassword(), currentUser.getPassword())) {
            throw new BusinessException("SAME_PASSWORD", "New password must be different from current password");
        }

        currentUser.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(currentUser);

        String emailContent = String.format(
                "Password Changed Successfully\n\n" +
                        "Hello %s,\n\n" +
                        "Your password has been changed successfully for Library Management System.\n\n" +
                        "If you did not perform this action, please contact us immediately.\n\n" +
                        "Best regards,\n" +
                        "Library Management Team",
                currentUser.getFullName());

        emailService.sendSimpleEmail(
                currentUser.getEmail(),
                "Password Changed - Library Management System",
                emailContent);
    }
}
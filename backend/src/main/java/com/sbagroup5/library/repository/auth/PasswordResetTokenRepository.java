package com.sbagroup5.library.repository.auth;

import java.util.Optional;

import com.sbagroup5.library.entity.auth.PasswordResetToken;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);

    void deleteByUser(String username);
}

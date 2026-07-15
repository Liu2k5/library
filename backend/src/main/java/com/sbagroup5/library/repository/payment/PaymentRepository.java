package com.sbagroup5.library.repository.payment;

import java.util.Optional;

import com.sbagroup5.library.entity.payment.Payment;
import com.sbagroup5.library.entity.payment.PaymentStatus;
import com.sbagroup5.library.entity.payment.PaymentType;
import com.sbagroup5.library.entity.user.User;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.status = :status")
    Long sumAmountByStatus(@Param("status") PaymentStatus status);

    Page<Payment> findByUser(User user, Pageable pageable);

    Optional<Payment> findFirstByUserAndTypeAndStatusOrderByDateDesc(
            User user,
            PaymentType type,
            PaymentStatus status);

    boolean existsByUserAndTypeAndStatus(
            User user,
            PaymentType type,
            PaymentStatus status);
}
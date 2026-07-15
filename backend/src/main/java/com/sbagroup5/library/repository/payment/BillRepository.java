package com.sbagroup5.library.repository.payment;

import java.util.Optional;

import com.sbagroup5.library.entity.payment.Bill;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BillRepository extends JpaRepository<Bill, Long> {
    Optional<Bill> findByPaymentId(Long paymentId);
}
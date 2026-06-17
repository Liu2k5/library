package com.sbagroup5.library.repository.payment;

import com.sbagroup5.library.entity.payment.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}

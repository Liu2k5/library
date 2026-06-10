package com.sbagroup5.library.repository.payment;

import com.sbagroup5.library.entity.payment.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<PaymentTransaction, Long> {
}

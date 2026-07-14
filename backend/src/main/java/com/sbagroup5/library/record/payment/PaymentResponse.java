package com.sbagroup5.library.record.payment;

import com.sbagroup5.library.entity.payment.PaymentStatus;
import com.sbagroup5.library.entity.payment.PaymentType;

import java.util.Date;

/**
 * Phản hồi thông tin thanh toán cho khách hàng.
 */
public record PaymentResponse(
        Long id,
        String username,
        Long amount,
        PaymentType type,
        PaymentStatus status,
        String method,
        Date date,
        String paymentUrl,
        String message
) {
}

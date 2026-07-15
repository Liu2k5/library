package com.sbagroup5.library.record.payment;

import java.util.Date;

import com.sbagroup5.library.entity.payment.BillStatus;

public record BillResponse(
        Long id,
        Long paymentId,
        String gatewayName,
        String transactionCode,
        BillStatus status,
        Date createdAt) {
}
package com.sbagroup5.library.record.payment;

import com.sbagroup5.library.entity.payment.PaymentType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

/**
 * Yêu cầu tạo một giao dịch thanh toán mới.
 */
public record PaymentRequest(
        @NotNull(message = "Loại thanh toán không được để trống")
        PaymentType type,

        @NotNull(message = "Số tiền không được để trống")
        @Positive(message = "Số tiền phải lớn hơn 0")
        Long amount,

        // Nếu type = FINE, cần cung cấp fineId để tự động cập nhật trạng thái fine
        Long fineId,

        // Nếu type = MEMBERSHIP, cần cung cấp membershipTypeId để xác định loại membership
        Long membershipTypeId
) {
}

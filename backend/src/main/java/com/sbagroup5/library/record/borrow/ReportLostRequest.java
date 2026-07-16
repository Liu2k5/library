package com.sbagroup5.library.record.borrow;

import java.io.Serializable;

/**
 * Yêu cầu lập phiếu phạt do mất sách.
 *
 * @param borrowId id phiếu mượn chứa bản sao bị mất
 * @param barcode  mã vạch của bản sao sách bị mất
 * @param amount   số tiền phạt (tùy chọn); nếu null sẽ lấy theo giá sách
 * @param reason   lý do phạt (tùy chọn); nếu null sẽ tự sinh "Mất sách: <tên sách>"
 */
public record ReportLostRequest(
        Long borrowId,
        String barcode,
        Long amount,
        String reason) implements Serializable {
}

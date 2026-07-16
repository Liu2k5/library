package com.sbagroup5.library.record.borrow;

import java.io.Serializable;
import java.util.Date;

/**
 * Thông tin đầy đủ của một phiếu phạt dùng cho màn quản lý của thủ thư.
 */
public record FineDetailResponse(
        Long id,
        Long borrowId,
        String barcode,
        String bookTitle,
        String memberUsername,
        String memberFullName,
        String memberEmail,
        Long amount,
        String reason,
        Date issuedDate,
        String status) implements Serializable {
}

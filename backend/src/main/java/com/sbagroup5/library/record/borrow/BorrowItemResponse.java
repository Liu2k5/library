package com.sbagroup5.library.record.borrow;

import java.io.Serializable;
import java.util.Date;

/**
 * Một dòng chi tiết trong phiếu mượn (tương ứng một bản sao sách).
 */
public record BorrowItemResponse(
        Long detailId,
        Long copyId,
        String barcode,
        String bookTitle,
        Date returnDate,
        String status) implements Serializable {
}

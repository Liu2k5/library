package com.sbagroup5.library.record.borrow;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * Thông tin một phiếu mượn trả về cho phía client.
 */
public record BorrowResponse(
        Long id,
        String username,
        String fullName,
        Date borrowDate,
        Date dueDate,
        boolean returned,
        List<BorrowItemResponse> items) implements Serializable {
}

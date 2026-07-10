package com.sbagroup5.library.record.borrow;

import java.io.Serializable;
import java.util.Date;

/**
 * Thông tin một khoản phạt phát sinh khi trả sách trễ hạn.
 */
public record FineResponse(
        Long id,
        Long detailId,
        String barcode,
        Long amount,
        String reason,
        Date issuedDate,
        String status) implements Serializable {
}

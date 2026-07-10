package com.sbagroup5.library.record.borrow;

import java.io.Serializable;
import java.util.List;

/**
 * Yêu cầu trả sách cho một phiếu mượn.
 *
 * @param borrowId id của phiếu mượn
 * @param barcodes danh sách mã vạch cần trả; nếu để trống/null thì trả toàn bộ
 *                 các bản sao chưa trả của phiếu mượn
 */
public record ReturnRequest(
        Long borrowId,
        List<String> barcodes) implements Serializable {
}

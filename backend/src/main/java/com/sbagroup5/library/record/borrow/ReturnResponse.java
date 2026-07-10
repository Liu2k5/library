package com.sbagroup5.library.record.borrow;

import java.io.Serializable;
import java.util.List;

/**
 * Kết quả của thao tác trả sách.
 *
 * @param borrowId       id phiếu mượn
 * @param fullyReturned  toàn bộ sách trong phiếu đã được trả hay chưa
 * @param returnedItems  các bản sao vừa được trả trong lần này
 * @param fines          các khoản phạt phát sinh (nếu trả trễ hạn)
 */
public record ReturnResponse(
        Long borrowId,
        boolean fullyReturned,
        List<BorrowItemResponse> returnedItems,
        List<FineResponse> fines) implements Serializable {
}

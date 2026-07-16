package com.sbagroup5.library.record.borrow;

import java.io.Serializable;

/**
 * Yêu cầu đánh dấu một phiếu phạt đã thanh toán.
 *
 * @param copyStatus trạng thái mới cho bản sao sách (AVAILABLE/UNAVAILABLE);
 *                   null hoặc rỗng = giữ nguyên trạng thái hiện tại
 */
public record PayFineRequest(String copyStatus) implements Serializable {
}
